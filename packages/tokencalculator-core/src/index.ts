export interface TokenRates { inputPerMillion: number; outputPerMillion: number; cachedInputPerMillion?: number }
export interface TokenUsage { inputTokens: number; outputTokens?: number; cachedInputTokens?: number }
export interface TokenCostBreakdown { input: number; cachedInput: number; output: number; total: number }

const assertNonNegative = (name: string, value: number) => {
  if (!Number.isFinite(value) || value < 0) throw new RangeError(`${name} must be a finite, non-negative number`);
};

export function calculateTokenCost(usage: TokenUsage, rates: TokenRates): TokenCostBreakdown {
  const outputTokens = usage.outputTokens ?? 0;
  const cachedInputTokens = usage.cachedInputTokens ?? 0;
  const values: Record<string, number> = { inputTokens: usage.inputTokens, outputTokens, cachedInputTokens, inputPerMillion: rates.inputPerMillion, outputPerMillion: rates.outputPerMillion };
  if (rates.cachedInputPerMillion !== undefined) values.cachedInputPerMillion = rates.cachedInputPerMillion;
  for (const [name, value] of Object.entries(values)) assertNonNegative(name, value);
  if (cachedInputTokens > usage.inputTokens) throw new RangeError('cachedInputTokens cannot exceed inputTokens');
  const input = (usage.inputTokens - cachedInputTokens) / 1_000_000 * rates.inputPerMillion;
  const cachedInput = cachedInputTokens / 1_000_000 * (rates.cachedInputPerMillion ?? rates.inputPerMillion);
  const output = outputTokens / 1_000_000 * rates.outputPerMillion;
  return { input, cachedInput, output, total: input + cachedInput + output };
}

export function projectWorkload(perCall: number, requestsPerDay: number, daysPerMonth = 30) {
  assertNonNegative('perCall', perCall);
  assertNonNegative('requestsPerDay', requestsPerDay);
  assertNonNegative('daysPerMonth', daysPerMonth);
  const daily = perCall * requestsPerDay;
  return { perCall, daily, monthly: daily * daysPerMonth };
}

export function contextUsage(tokens: number, contextWindow: number) {
  assertNonNegative('tokens', tokens);
  if (!Number.isFinite(contextWindow) || contextWindow <= 0) throw new RangeError('contextWindow must be a finite, positive number');
  return { ratio: tokens / contextWindow, remaining: Math.max(0, contextWindow - tokens), overContext: tokens > contextWindow };
}
