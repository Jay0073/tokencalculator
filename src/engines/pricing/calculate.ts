import type { Accuracy, CalculationResult, ModelConfig } from '../../domain/models';

export function resolveRates(model: ModelConfig, inputTokens: number) {
  const tier = [...(model.pricingTiers ?? [])]
    .sort((a, b) => b.aboveInputTokens - a.aboveInputTokens)
    .find((candidate) => inputTokens > candidate.aboveInputTokens);
  return tier ?? {
    inputPerMillion: model.inputPerMillion,
    cachedInputPerMillion: model.cachedInputPerMillion,
    outputPerMillion: model.outputPerMillion,
    label: 'Standard rate',
  };
}

export function calculateInputCost(tokens: number, model: ModelConfig) {
  const safeTokens = Math.max(0, Math.round(tokens));
  return (safeTokens / 1_000_000) * resolveRates(model, safeTokens).inputPerMillion;
}

export function calculateWorkloadCost(inputTokens: number, outputTokens: number, model: ModelConfig) {
  const safeInput = Math.max(0, Math.round(inputTokens));
  const safeOutput = Math.max(0, Math.round(outputTokens));
  const rates = resolveRates(model, safeInput);
  return (safeInput / 1_000_000) * rates.inputPerMillion + (safeOutput / 1_000_000) * rates.outputPerMillion;
}

export function calculateResult(tokens: number, model: ModelConfig, accuracy: Accuracy, method: string): CalculationResult {
  const safeTokens = Math.max(0, Math.round(tokens));
  return {
    tokens: safeTokens,
    accuracy,
    cost: calculateInputCost(safeTokens, model),
    contextRatio: safeTokens / model.contextWindow,
    overContext: safeTokens > model.contextWindow,
    method,
  };
}
