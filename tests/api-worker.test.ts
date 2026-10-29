import { describe, expect, it, vi } from 'vitest';
import worker from '../worker/index';

const env = {
  ASSETS: { fetch: vi.fn(async () => new Response('asset')) },
  PUBLIC_API_RATE_LIMITER: { limit: vi.fn(async () => ({ success: true })) },
};

const post = (path: string, body: unknown) => worker.fetch(new Request(`https://tokencalculator.dev${path}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Request-Id': 'test-request' },
  body: JSON.stringify(body),
}), env);

const fetchWorker = (path: string, init: RequestInit = {}) => worker.fetch(
  new Request(`https://tokencalculator.dev${path}`, { headers: { 'X-Request-Id': 'test-request' }, ...init }),
  env,
);

describe('developer API worker', () => {
  it('counts audio, video, and PDF pages where the provider publishes a rate', async () => {
    const response = await post('/api/v1/count', {
      model: 'gemini-3.8-flash',
      input: { text: 'Summarise the call.', media: [{ kind: 'audio', seconds: 60 }, { kind: 'video', seconds: 10 }, { kind: 'pdf', pages: 2 }] },
      options: { include: ['usage', 'breakdown'] },
    });
    const body = await response.json() as any;
    expect(response.status).toBe(200);
    // 60s audio at 25/s, 10s video at 70 a frame plus 25 a second of sound, 2 pages at 560.
    expect(body.usage.media_tokens).toBe(1500 + 950 + 1120);
    expect(body.usage.text_tokens).toBeGreaterThan(0);
    expect(body.breakdown.map((item: any) => item.type)).toEqual(['text', 'audio', 'video', 'pdf']);
  });

  it('reports the reason instead of a number when no rate is published', async () => {
    const response = await post('/api/v1/count', {
      model: 'gpt-6-astra',
      input: { text: 'Summarise the call.', media: [{ kind: 'audio', seconds: 60 }] },
      options: { include: ['usage', 'breakdown'] },
    });
    const body = await response.json() as any;
    expect(response.status).toBe(200);
    expect(body.usage.media_tokens).toBe(0);
    expect(body.breakdown[1].method).toContain('does not accept audio');
  });

  it('rejects a media item without a usable measurement', async () => {
    const response = await post('/api/v1/count', { model: 'gemini-3.8-flash', input: { media: [{ kind: 'audio' }] } });
    expect(response.status).toBe(400);
    expect((await response.json() as any).detail).toContain('seconds');
  });

  it('counts mixed text, extracted files, and image inputs', async () => {
    const response = await post('/api/v1/count', {
      model: 'gpt-5.6-terra',
      input: {
        text: 'A short prompt.',
        files: [{ name: 'app.ts', media_type: 'text/typescript', content: 'export const ready = true;' }],
        images: [{ width: 512, height: 512, detail: 'low' }],
      },
      output_tokens: 100,
    });
    const body = await response.json() as any;

    expect(response.status).toBe(200);
    expect(response.headers.get('x-request-id')).toBe('test-request');
    expect(body.model.id).toBe('gpt-5.6-terra');
    expect(body.breakdown.map((item: any) => item.type)).toEqual(['text', 'file', 'image']);
    expect(body.usage.total_tokens).toBe(body.usage.input_tokens + 100);
    expect(body.cost.currency).toBe('USD');
  });

  it('preserves batch ordering and compares multiple models', async () => {
    const batch = await post('/api/v1/batch', { requests: [
      { model: 'gpt-5.6-terra', input: { text: 'first' } },
      { model: 'claude-opus-4-8', input: { text: 'second' } },
    ] });
    const batchBody = await batch.json() as any;
    expect(batchBody.data.map((item: any) => item.index)).toEqual([0, 1]);

    const comparison = await post('/api/v1/compare', {
      models: ['gpt-5.6-terra', 'claude-opus-4-8'],
      request: { input: { text: 'Compare this payload.' }, output_tokens: 50 },
    });
    const comparisonBody = await comparison.json() as any;
    expect(comparisonBody.data.map((item: any) => item.model.id)).toEqual(['gpt-5.6-terra', 'claude-opus-5']);
  });

  it('returns RFC 9457 problem details for invalid requests', async () => {
    const response = await post('/api/v1/count', { model: 'unknown', input: { text: 'test' } });
    const body = await response.json() as any;

    // An unrecognised model id is a caller mistake, so it is a 400 with its own
    // problem type rather than a generic 422 a client cannot branch on.
    expect(response.status).toBe(400);
    expect(response.headers.get('content-type')).toContain('application/problem+json');
    expect(body.title).toBe('Unknown model');
    expect(body.type).toContain('#error-unknown-model');
    expect(body.instance).toContain('test-request');
    expect(response.headers.get('x-request-id')).toBeTruthy();
  });

  it('resolves common vendor aliases to supported models', async () => {
    for (const [alias, expected] of [
      ['gpt-4o', 'gpt-5.6-terra'],
      ['claude-3-5-sonnet', 'claude-sonnet-5'],
      ['gemini-1.5-pro', 'gemini-2.5-pro'],
      ['deepseek-chat', 'deepseek-flash'],
    ] as const) {
      const response = await post('/api/v1/count', { model: alias, input: { text: 'hello' } });
      expect(response.status, `alias ${alias}`).toBe(200);
      expect((await response.json() as any).model.id, `alias ${alias}`).toBe(expected);
    }
  });

  it('answers HEAD on every route that answers GET', async () => {
    for (const path of ['/api/v1/health', '/api/v1/models']) {
      const head = await fetchWorker(path, { method: 'HEAD' });
      expect(head.status, path).toBe(200);
      expect(head.headers.get('content-type'), path).toContain('application/json');
      expect(await head.text(), path).toBe('');
    }
  });

  it('separates an unknown path from a wrong method', async () => {
    const missing = await fetchWorker('/api/v1/nope');
    expect(missing.status).toBe(404);
    expect((await missing.json() as any).type).toContain('#error-endpoint-not-found');

    const wrongMethod = await fetchWorker('/api/v1/count');
    expect(wrongMethod.status).toBe(405);
    expect(wrongMethod.headers.get('allow')).toBe('POST');
  });

  it('serves the bare /api path as JSON, never as an HTML page', async () => {
    const response = await fetchWorker('/api');
    expect(response.status).toBe(404);
    expect(response.headers.get('content-type')).toContain('application/problem+json');
  });

  it('makes the model catalogue cacheable and revalidatable', async () => {
    const response = await fetchWorker('/api/v1/models');
    expect(response.headers.get('cache-control')).toContain('max-age=');
    const etag = response.headers.get('etag');
    expect(etag).toBeTruthy();

    const revalidated = await fetchWorker('/api/v1/models', { headers: { 'if-none-match': etag! } });
    expect(revalidated.status).toBe(304);
  });

  it('names the failing entry when one batch item is invalid', async () => {
    const response = await post('/api/v1/batch', {
      requests: [
        { model: 'gpt-5.6-terra', input: { text: 'fine' } },
        { model: 'not-a-real-model', input: { text: 'broken' } },
      ],
    });
    const body = await response.json() as any;
    expect(response.status).toBe(400);
    expect(body.errors?.[0]?.index).toBe(1);
  });
});
