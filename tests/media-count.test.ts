import { describe, expect, it } from 'vitest';
import { countMedia } from '../src/engines/media/count';
import { getModel } from '../src/data/models';
import { MODELS as SITE_MODELS } from '../src/data/models';
import { countMediaTokens, measureModel } from '../packages/tokencalculator-core/src/index';

const tokensOf = (result: ReturnType<typeof countMedia>) => (result.supported ? result.tokens : -1);

describe('published media formulas', () => {
  // ai.google.dev/gemini-api/docs/media-resolution
  it('bills Gemini 3 audio at 25 tokens a second', () => {
    const model = getModel('gemini-3.8-flash');
    expect(tokensOf(countMedia({ kind: 'audio', seconds: 60 }, model))).toBe(1500);
    // Part seconds are billed whole.
    expect(tokensOf(countMedia({ kind: 'audio', seconds: 90.2 }, model))).toBe(2275);
  });

  it('bills Gemini 4 media with the published Gemini 3 and 4 budgets', () => {
    const model = getModel('gemini-4-hydrogen');
    const audio = countMedia({ kind: 'audio', seconds: 60 }, model);
    const video = countMedia({ kind: 'video', seconds: 30 }, model);
    const pdf = countMedia({ kind: 'pdf', pages: 3 }, model);
    expect(tokensOf(audio)).toBe(1500);
    expect(tokensOf(video)).toBe(2850);
    expect(tokensOf(pdf)).toBe(1680);
    expect(audio.supported && audio.method).toContain('Gemini 4 audio');
    expect(countMediaTokens({ kind: 'video', seconds: 30 }, 'gemini-4-hydrogen')).toMatchObject(video);
  });

  it('bills Gemini 2.x audio at 32 tokens a second', () => {
    // Google's own worked example: one minute of audio is 1,920 tokens.
    expect(tokensOf(countMedia({ kind: 'audio', seconds: 60 }, getModel('gemini-2.5-pro')))).toBe(1920);
  });

  it('samples video at one frame a second and adds the sound track', () => {
    const model = getModel('gemini-3.8-flash');
    // 30s of video with sound: 70 tokens a frame plus 25 tokens a second.
    expect(tokensOf(countMedia({ kind: 'video', seconds: 30 }, model))).toBe(30 * 95);
    expect(tokensOf(countMedia({ kind: 'video', seconds: 30, sound: false }, model))).toBe(2100);
    expect(tokensOf(countMedia({ kind: 'video', seconds: 30, detail: 'high' }, model))).toBe(30 * 305);
    // Gemini 2.x: 66 tokens a frame plus 32 a second, which is Google's "about 100
    // tokens per second of video at the default resolution".
    expect(tokensOf(countMedia({ kind: 'video', seconds: 1 }, getModel('gemini-2.5-pro')))).toBe(98);
  });

  it('bills PDF pages at the documented per-page rate', () => {
    expect(tokensOf(countMedia({ kind: 'pdf', pages: 3 }, getModel('gemini-3.8-flash')))).toBe(1680);
    expect(tokensOf(countMedia({ kind: 'pdf', pages: 3, detail: 'low' }, getModel('gemini-3.8-flash')))).toBe(840);
    expect(tokensOf(countMedia({ kind: 'pdf', pages: 3 }, getModel('gemini-2.5-pro')))).toBe(774);
  });
});

describe('media inputs without a published rate', () => {
  it('says so when a model cannot accept the input at all', () => {
    const result = countMedia({ kind: 'audio', seconds: 60 }, getModel('claude-sonnet-5-5'));
    expect(result.supported).toBe(false);
    expect(result.supported === false && result.reason).toContain('does not accept audio');
  });

  it('separates "not accepted" from "no published rate"', () => {
    // Qwen3.8 Max takes video upstream, but Alibaba publishes no token rate for it.
    const video = countMedia({ kind: 'video', seconds: 10 }, getModel('qwen3.8-max'));
    expect(video.supported).toBe(false);
    expect(video.supported === false && video.reason).toContain('no token rate is published');
  });

  it('explains the PDF page images it cannot price', () => {
    const result = countMedia({ kind: 'pdf', pages: 4 }, getModel('gpt-6-astra'));
    expect(result.supported).toBe(false);
    expect(result.supported === false && result.reason).toContain('Page text is counted');
  });

  it('never invents a number for a model that publishes no rate', () => {
    for (const model of [getModel('gpt-6-astra'), getModel('claude-opus-5-5'), getModel('grok-4.7')]) {
      for (const kind of ['audio', 'video', 'pdf'] as const) {
        expect(countMedia({ kind, seconds: 30, pages: 2 }, model).supported, `${model.id} ${kind}`).toBe(false);
      }
    }
  });
});

describe('media parity with the npm package', () => {
  it('counts audio, video and PDFs identically on both surfaces', () => {
    for (const model of SITE_MODELS) {
      for (const input of [
        { kind: 'audio' as const, seconds: 95 },
        { kind: 'video' as const, seconds: 12 },
        { kind: 'video' as const, seconds: 12, detail: 'high' as const },
        { kind: 'pdf' as const, pages: 7 },
      ]) {
        const site = countMedia(input, model);
        const pkg = countMediaTokens(input, model.id);
        expect(pkg.supported, `${model.id} ${input.kind}`).toBe(site.supported);
        if (site.supported && pkg.supported) {
          expect(pkg.tokens, `${model.id} ${input.kind}`).toBe(site.tokens);
          expect(pkg.method, `${model.id} ${input.kind}`).toBe(site.method);
        } else if (!site.supported && !pkg.supported) {
          expect(pkg.reason, `${model.id} ${input.kind}`).toBe(site.reason);
        }
      }
    }
  });

  it('adds media tokens to a package measurement', async () => {
    const withMedia = await measureModel({ text: 'Summarise this call.', media: [{ kind: 'audio', seconds: 120 }] }, 'gemini-3.8-flash');
    const textOnly = await measureModel({ text: 'Summarise this call.' }, 'gemini-3.8-flash');
    // Two minutes of audio at 25 tokens a second.
    expect(withMedia.inputTokens - textOnly.inputTokens).toBe(3000);
    expect(withMedia.method).toContain('Gemini 3 audio');
    // A model with no published audio rate counts the text only, and never guesses.
    const unsupported = await measureModel({ text: 'Summarise this call.', media: [{ kind: 'audio', seconds: 120 }] }, 'gpt-6-astra');
    const unsupportedText = await measureModel({ text: 'Summarise this call.' }, 'gpt-6-astra');
    expect(unsupported.inputTokens).toBe(unsupportedText.inputTokens);
  });
});
