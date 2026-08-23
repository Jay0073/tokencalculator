import { describe, expect, it } from 'vitest';
import { calculateTokenCost, contextUsage, projectWorkload } from '../packages/tokencalculator-core/src/index';

describe('companion package', () => {
  it('prices uncached, cached, and output tokens independently', () => {
    const result = calculateTokenCost(
      { inputTokens: 500_000, cachedInputTokens: 100_000, outputTokens: 2_000 },
      { inputPerMillion: 2, cachedInputPerMillion: 0.2, outputPerMillion: 12 },
    );
    expect(result.input).toBeCloseTo(0.8);
    expect(result.cachedInput).toBeCloseTo(0.02);
    expect(result.output).toBeCloseTo(0.024);
    expect(result.total).toBeCloseTo(0.844);
  });

  it('projects daily and monthly workload cost', () => {
    expect(projectWorkload(0.25, 1_000)).toEqual({ perCall: 0.25, daily: 250, monthly: 7_500 });
  });

  it('reports context overflow and validates invalid usage', () => {
    expect(contextUsage(120, 100)).toEqual({ ratio: 1.2, remaining: 0, overContext: true });
    expect(() => calculateTokenCost(
      { inputTokens: 10, cachedInputTokens: 11 },
      { inputPerMillion: 1, outputPerMillion: 1 },
    )).toThrow('cachedInputTokens cannot exceed inputTokens');
  });
});
