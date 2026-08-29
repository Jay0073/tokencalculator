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

describe('developer API worker', () => {
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
      { model: 'claude-opus-4.8', input: { text: 'second' } },
    ] });
    const batchBody = await batch.json() as any;
    expect(batchBody.data.map((item: any) => item.index)).toEqual([0, 1]);

    const comparison = await post('/api/v1/compare', {
      models: ['gpt-5.6-terra', 'claude-opus-4.8'],
      request: { input: { text: 'Compare this payload.' }, output_tokens: 50 },
    });
    const comparisonBody = await comparison.json() as any;
    expect(comparisonBody.data.map((item: any) => item.model.id)).toEqual(['gpt-5.6-terra', 'claude-opus-4.8']);
  });

  it('returns RFC 9457 problem details for invalid requests', async () => {
    const response = await post('/api/v1/count', { model: 'unknown', input: { text: 'test' } });
    const body = await response.json() as any;

    expect(response.status).toBe(422);
    expect(response.headers.get('content-type')).toContain('application/problem+json');
    expect(body.title).toBe('Validation failed');
    expect(body.instance).toContain('test-request');
  });
});
