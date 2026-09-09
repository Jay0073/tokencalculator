import type { ModelConfig, ProviderId } from '../domain/models';

type ModelsDevModel = {
  id: string;
  limit?: { context?: number; output?: number };
  cost?: { input?: number; output?: number; cache_read?: number };
};

type ModelsDevResponse = Partial<Record<ProviderId, { models?: Record<string, ModelsDevModel> }>>;

// Explicit overrides for ids that do not follow the dotted -> dashed convention.
const MODEL_ALIASES: Partial<Record<string, string>> = {};

// models.dev writes Anthropic versions with dashes ('claude-opus-4-8') while this
// catalogue uses dots ('claude-opus-4.8'). Try the exact id first, then the dashed
// form, so every current and future Claude release resolves without a hand-written entry.
function candidateIds(id: string): string[] {
  const alias = MODEL_ALIASES[id];
  const dashed = id.replace(/\./g, '-');
  return [...new Set([alias, id, dashed].filter(Boolean) as string[])];
}

export interface PricingSnapshot {
  models: ModelConfig[];
  source: 'models.dev' | 'bundled';
}

export async function loadLivePricing(models: ModelConfig[]): Promise<PricingSnapshot> {
  try {
    const response = await fetch('https://models.dev/api.json', { signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error(`Models.dev returned ${response.status}`);
    const catalog = await response.json() as ModelsDevResponse;
    const updated = models.map((model) => {
      const providerModels = catalog[model.provider]?.models;
      const live = providerModels
        ? candidateIds(model.id).map((id) => providerModels[id]).find(Boolean)
        : undefined;
      if (!live) return model;
      return {
        ...model,
        contextWindow: live.limit?.context ?? model.contextWindow,
        maxOutput: live.limit?.output ?? model.maxOutput,
        inputPerMillion: live.cost?.input ?? model.inputPerMillion,
        cachedInputPerMillion: live.cost?.cache_read ?? model.cachedInputPerMillion,
        outputPerMillion: live.cost?.output ?? model.outputPerMillion,
      };
    });
    return { models: updated, source: 'models.dev' };
  } catch {
    return { models, source: 'bundled' };
  }
}
