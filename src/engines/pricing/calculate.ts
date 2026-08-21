import type { Accuracy, CalculationResult, ModelConfig } from '../../domain/models';

export function calculateResult(tokens: number, model: ModelConfig, accuracy: Accuracy, method: string): CalculationResult {
  const safeTokens = Math.max(0, Math.round(tokens));
  return {
    tokens: safeTokens,
    accuracy,
    cost: (safeTokens / 1_000_000) * model.inputPerMillion,
    contextRatio: safeTokens / model.contextWindow,
    overContext: safeTokens > model.contextWindow,
    method,
  };
}
