import { describe, expect, it } from 'vitest';
import { MODELS, MODEL_ALIASES, BYTES_PER_TOKEN as CORE_BYTES, getModel, resolveModelId } from '../packages/tokencalculator-core/src/index';
import { BYTES_PER_TOKEN as SITE_BYTES } from '../src/engines/tokenizers/count';
import { MODELS as SITE_MODELS } from '../src/data/models';
import { MODELS as PIECE_MODELS } from '../packages/activepieces-tokencalculator/src/lib/calculator';
import { PROVIDERS } from '../src/data/providers';
import policy from '../scripts/model-policy.json';
import { COMPARISONS } from '../src/data/comparisons';

/**
 * The catalogue is generated from models.dev by scripts/sync-models.mjs into three
 * places. These tests pin the invariants that generation must never break - the kind
 * that previously let prices drift and alias targets rot without anyone noticing.
 */
describe('generated model catalogue', () => {
  it('publishes the same model ids to the site, the npm package, and the Activepieces piece', () => {
    const core = MODELS.map((model) => model.id);
    expect(SITE_MODELS.map((model) => model.id)).toEqual(core);
    expect(PIECE_MODELS.map((model) => model.id)).toEqual(core);
  });

  it('publishes the same rates in all three catalogues', () => {
    for (const model of MODELS) {
      const site = SITE_MODELS.find((candidate) => candidate.id === model.id)!;
      const piece = PIECE_MODELS.find((candidate) => candidate.id === model.id)!;
      expect(site.inputPerMillion, model.id).toBe(model.inputPerMillion);
      expect(site.outputPerMillion, model.id).toBe(model.outputPerMillion);
      expect(piece.inputPerMillion, model.id).toBe(model.inputPerMillion);
      expect(piece.outputPerMillion, model.id).toBe(model.outputPerMillion);
    }
  });

  it('resolves every alias to a model that exists', () => {
    for (const [alias, target] of Object.entries(MODEL_ALIASES)) {
      expect(MODELS.some((model) => model.id === target), `alias '${alias}' points at missing model '${target}'`).toBe(true);
      expect(() => getModel(alias), `alias '${alias}'`).not.toThrow();
    }
  });

  it('keeps every pinned model in the published catalogue', () => {
    for (const id of policy.pinned) {
      expect(MODELS.some((model) => model.id === id), `pinned model '${id}' was dropped`).toBe(true);
    }
  });

  it('has a display name and provider entry for every model', () => {
    for (const model of MODELS) {
      expect(model.name.length, model.id).toBeGreaterThan(0);
      expect(PROVIDERS[model.provider], `no PROVIDERS entry for '${model.provider}'`).toBeDefined();
    }
  });

  it('never publishes a zero or negative rate', () => {
    for (const model of MODELS) {
      expect(model.inputPerMillion, model.id).toBeGreaterThan(0);
      expect(model.outputPerMillion, model.id).toBeGreaterThan(0);
      expect(model.contextWindow, model.id).toBeGreaterThan(0);
    }
  });

  it('resolves ids case-insensitively and in dashed form', () => {
    expect(resolveModelId('GPT-5.6-Terra')).toBe('gpt-5.6-terra');
    expect(resolveModelId('claude-opus-4-8')).toBe('claude-opus-4-8');
    expect(resolveModelId('not-a-model')).toBeUndefined();
  });

  it('covers every provider named in the sync policy', () => {
    for (const providerId of Object.keys(policy.providers)) {
      expect(MODELS.some((model) => model.provider === providerId), `no models published for '${providerId}'`).toBe(true);
    }
  });

  it('publishes both models of every comparison page', () => {
    // The site's getModel falls back to the default model for an unknown id, so a
    // comparison whose model was dropped would quietly show GPT-5.6 Terra instead.
    for (const page of COMPARISONS) {
      for (const id of [page.leftId, page.rightId]) {
        expect(SITE_MODELS.some((model) => model.id === id), `${page.slug} uses unpublished model '${id}'`).toBe(true);
        expect(policy.pinned, `${page.slug} uses '${id}', which is not pinned`).toContain(id);
      }
    }
  });

  it('applies every sourced price correction and marks it', () => {
    for (const [id, fix] of Object.entries(policy.corrections as Record<string, { inputPerMillion: number; outputPerMillion: number; source: string }>)) {
      const model = SITE_MODELS.find((candidate) => candidate.id === id);
      expect(model, `corrected model '${id}' is not published`).toBeDefined();
      expect(model!.inputPerMillion, id).toBe(fix.inputPerMillion);
      expect(model!.outputPerMillion, id).toBe(fix.outputPerMillion);
      expect(model!.rateSource, id).toBe(fix.source);
    }
  });

  it('uses one bytes-per-token table across the site and the npm package', () => {
    // The site engine used to carry a shorter list of its own, which counted Qwen, Kimi
    // and GLM text at 4 bytes per token while the package used 3.7.
    for (const [family, bytes] of Object.entries(SITE_BYTES)) {
      if (!(family in CORE_BYTES)) continue;
      expect(bytes, `bytes per token for '${family}'`).toBe(CORE_BYTES[family as keyof typeof CORE_BYTES]);
    }
  });

  it('splits Claude into the pre-4.7 and 4.7-and-later tokenizers', () => {
    // Anthropic documents ~30% more tokens for the same text on Claude 4.7 and later.
    const ratio = SITE_BYTES['claude-estimate'] / SITE_BYTES['claude-47-estimate'];
    expect(ratio).toBeGreaterThan(1.28);
    expect(ratio).toBeLessThan(1.32);
    const tokenizerOf = (id: string) => SITE_MODELS.find((model) => model.id === id)?.tokenizer;
    expect(tokenizerOf('claude-haiku-4-5'), 'Haiku 4.5 predates Claude Opus 4.7').toBe('claude-estimate');
    for (const id of ['claude-opus-4-8', 'claude-sonnet-5', 'claude-opus-5', 'claude-fable-5-1', 'claude-opus-5-5', 'claude-sonnet-5-5']) {
      expect(tokenizerOf(id), id).toBe('claude-47-estimate');
    }
  });

  it('exposes a single default model', () => {
    expect(SITE_MODELS.filter((model) => model.isDefault)).toHaveLength(1);
    expect(SITE_MODELS.find((model) => model.isDefault)!.id).toBe(policy.defaultModel);
  });
});
