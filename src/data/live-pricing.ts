import type { ModelConfig, ProviderId } from '../domain/models';

type ModelsDevModel = {
  id: string;
  limit?: { context?: number; output?: number };
  cost?: { input?: number; output?: number };
};

type ModelsDevResponse = Partial<Record<ProviderId, { models?: Record<string, ModelsDevModel> }>>;

const MODEL_ALIASES: Partial<Record<string, string>> = {
  'claude-opus-4.8': 'claude-opus-4-8',
};

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
      const externalId = MODEL_ALIASES[model.id] ?? model.id;
      const live = catalog[model.provider]?.models?.[externalId];
      if (!live) return model;
      return {
        ...model,
        contextWindow: live.limit?.context ?? model.contextWindow,
        maxOutput: live.limit?.output ?? model.maxOutput,
        inputPerMillion: live.cost?.input ?? model.inputPerMillion,
        outputPerMillion: live.cost?.output ?? model.outputPerMillion,
      };
    });
    return { models: updated, source: 'models.dev' };
  } catch {
    return { models, source: 'bundled' };
  }
}
