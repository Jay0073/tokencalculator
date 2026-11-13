import { afterEach, describe, expect, it, vi } from 'vitest';
import { getModel } from '../src/data/models';
import { loadLivePricing } from '../src/data/live-pricing';
import { calculateResult, calculateWorkloadCost, resolveRates } from '../src/engines/pricing/calculate';
import { countImage } from '../src/engines/vision/count';
import { countText, inspectText } from '../src/engines/tokenizers/count';

afterEach(() => vi.unstubAllGlobals());

describe('pricing and context', () => {
  it('calculates per-million input pricing', () => {
    const model = getModel('gpt-5.6-sol');
    // Derive the expectation from the catalogue rather than pinning a literal, so a
    // legitimate price update does not fail the test and a stale rate is not baked in.
    const expected = (100_000 / 1_000_000) * model.inputPerMillion;
    expect(calculateResult(100_000, model, 'exact', 'test').cost).toBeCloseTo(expected, 10);
  });

  it('scales input cost linearly inside the base pricing tier', () => {
    const model = getModel('gpt-5.6-sol');
    const tierStart = model.pricingTiers?.[0]?.aboveInputTokens ?? Infinity;
    const base = Math.floor(Math.min(tierStart, 1_000_000) / 4);
    const single = calculateResult(base, model, 'exact', 'test').cost;
    expect(single).toBeCloseTo((base / 1_000_000) * model.inputPerMillion, 10);
    expect(calculateResult(base * 2, model, 'exact', 'test').cost).toBeCloseTo(single * 2, 10);
  });

  it('applies the long-context tier above its threshold', () => {
    const model = getModel('gpt-5.6-sol');
    const tier = model.pricingTiers?.[0];
    expect(tier, 'gpt-5.6-sol should declare a long-context tier').toBeDefined();
    const above = tier!.aboveInputTokens + 1_000;
    const charged = calculateResult(above, model, 'exact', 'test').cost;
    // Above the threshold the tier rate applies, so cost must exceed the base rate.
    expect(charged).toBeGreaterThan((above / 1_000_000) * model.inputPerMillion);
    expect(charged).toBeCloseTo((above / 1_000_000) * tier!.inputPerMillion, 10);
  });

  it('marks context overflow', () => {
    const model = getModel('deepseek-flash');
    expect(calculateResult(model.contextWindow + 1, model, 'estimated', 'test').overContext).toBe(true);
  });

  it('applies OpenAI long-context rates only above 272K input tokens', () => {
    const model = getModel('gpt-5.6-terra');
    expect(resolveRates(model, 272_000).inputPerMillion).toBe(2);
    expect(resolveRates(model, 272_001)).toMatchObject({ inputPerMillion: 4, outputPerMillion: 18 });
    expect(calculateWorkloadCost(300_000, 1_000, model)).toBeCloseTo(1.218);
  });

  it('applies Gemini 2.5 Pro long-context rates above 200K', () => {
    expect(resolveRates(getModel('gemini-2.5-pro'), 200_001)).toMatchObject({ inputPerMillion: 2.5, cachedInputPerMillion: .25, outputPerMillion: 15 });
  });
});

describe('exact token inspection', () => {
  it('returns reversible o200k token pieces', () => {
    const text = 'Hello, token world 👋';
    const pieces = inspectText(text, getModel('gpt-5.6-terra'));
    expect(pieces.map((piece) => piece.text).join('')).toBe(text);
    expect(pieces.reduce((total, piece) => total + piece.tokenIds.length, 0)).toBe(countText(text, getModel('gpt-5.6-terra')).tokens);
  });

  it('rejects heuristic tokenizers', () => {
    expect(() => inspectText('hello', getModel('claude-sonnet-5'))).toThrow(/exact BPE/i);
  });
});

describe('live pricing overlay', () => {
  it('updates pricing and limits from Models.dev', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ openai: { models: { 'gpt-5.6-terra': { id: 'gpt-5.6-terra', cost: { input: 9, output: 18, cache_read: 3 }, limit: { context: 999_000, output: 12_000 } } } } }),
    }));
    const snapshot = await loadLivePricing([getModel('gpt-5.6-terra')]);
    expect(snapshot.source).toBe('models.dev');
    expect(snapshot.models[0]).toMatchObject({ inputPerMillion: 9, outputPerMillion: 18, cachedInputPerMillion: 3, contextWindow: 999_000, maxOutput: 12_000 });
  });

  it('keeps bundled pricing when the catalog is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const model = getModel('gpt-5.6-terra');
    const snapshot = await loadLivePricing([model]);
    expect(snapshot).toEqual({ models: [model], source: 'bundled' });
  });
});

describe('published image formulas', () => {
  // OpenAI's own worked examples: developers.openai.com/api/docs/guides/images-vision
  it('matches OpenAI\u2019s worked patch examples', () => {
    expect(countImage({ width: 1024, height: 1024 }, getModel('gpt-6-astra')).tokens).toBe(1229);
    expect(countImage({ width: 2048, height: 2048 }, getModel('gpt-6-astra')).tokens).toBe(3000);
    expect(countImage({ width: 1024, height: 1024 }, getModel('gpt-6-astra')).accuracy).toBe('provider-formula');
  });

  it('flags OpenAI models that publish no patch budget', () => {
    for (const id of ['gpt-6-sol', 'gpt-6.1-sol', 'gpt-6-luna']) {
      const result = countImage({ width: 1024, height: 1024 }, getModel(id));
      expect(result.tokens).toBe(1229);
      expect(result.accuracy).toBe('estimated');
      expect(result.method).toContain('budget not published');
    }
  });

  it('keeps the legacy OpenAI tile rule available', () => {
    const legacy = { ...getModel('gpt-5.6-terra'), vision: 'openai-tiles' as const };
    expect(countImage({ width: 4000, height: 2000, detail: 'low' }, legacy).tokens).toBe(85);
    expect(countImage({ width: 1024, height: 1024 }, legacy).tokens).toBe(765);
  });

  // Anthropic publishes a table of dimensions against tokens, for both image budgets:
  // platform.claude.com/docs/en/build-with-claude/vision
  it('reproduces Anthropic\u2019s published table on both tiers', () => {
    const standard = { ...getModel('claude-haiku-5-5'), tokenizer: 'claude-estimate' as const }; // Claude 4.6 and earlier: 1,568 tokens
    const large = getModel('claude-sonnet-5-5'); // Claude 4.7 and later: 4,784 tokens
    const rows: [number, number, number, number][] = [
      // width, height, standard tier, large tier
      [200, 200, 64, 64],
      [1000, 1000, 1296, 1296],
      [1092, 1092, 1521, 1521],
      [1920, 1080, 1560, 2691],
      [2000, 1500, 1564, 3888],
      [3840, 2160, 1560, 4784],
    ];
    for (const [width, height, small, big] of rows) {
      expect(countImage({ width, height }, standard).tokens).toBe(small);
      expect(countImage({ width, height }, large).tokens).toBe(big);
    }
  });

  // Gemini 3 and 4 spend a fixed budget per image, whatever its size:
  // ai.google.dev/gemini-api/docs/media-resolution
  it('spends Gemini 3 and 4 media_resolution budgets', () => {
    for (const id of ['gemini-3.8-flash', 'gemini-4-hydrogen', 'gemini-4-carbon']) {
      for (const size of [[384, 384], [1024, 1024], [3840, 2160]] as const) {
        expect(countImage({ width: size[0], height: size[1] }, getModel(id)).tokens).toBe(1120);
        expect(countImage({ width: size[0], height: size[1], detail: 'low' }, getModel(id)).tokens).toBe(280);
      }
    }
  });

  it('keeps the 258-token tile rule for Gemini 2.x', () => {
    const legacy = getModel('gemini-2.5-pro');
    expect(countImage({ width: 384, height: 384 }, legacy).tokens).toBe(258);
    expect(countImage({ width: 1024, height: 1024 }, legacy).tokens).toBe(1032);
    // Oversized images are scaled into 3072x3072 before tiling, so the count is bounded.
    expect(countImage({ width: 8000, height: 8000 }, legacy).tokens).toBe(4128);
  });
});
