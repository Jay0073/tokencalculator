export type ProviderId = 'openai' | 'anthropic' | 'google' | 'deepseek';
export type Accuracy = 'exact' | 'provider-formula' | 'estimated';
export type TokenizerStrategy = 'o200k_base' | 'cl100k_base' | 'claude-estimate' | 'gemini-estimate' | 'deepseek-estimate';
export type VisionStrategy = 'openai-tiles' | 'claude-patches' | 'gemini-tiles';

export interface PricingTier {
  aboveInputTokens: number;
  inputPerMillion: number;
  cachedInputPerMillion?: number;
  outputPerMillion: number;
  label: string;
}

export interface ModelConfig {
  id: string;
  name: string;
  provider: ProviderId;
  description: string;
  tokenizer: TokenizerStrategy;
  textAccuracy: Accuracy;
  contextWindow: number;
  maxOutput: number;
  inputPerMillion: number;
  cachedInputPerMillion?: number;
  outputPerMillion: number;
  pricingTiers?: PricingTier[];
  vision?: VisionStrategy;
  pricingUrl: string;
  verifiedAt: string;
  isDefault?: boolean;
}

export interface TokenInspectionPiece {
  text: string;
  tokenIds: number[];
}

export interface CalculationResult {
  tokens: number;
  accuracy: Accuracy;
  cost: number;
  contextRatio: number;
  overContext: boolean;
  method: string;
}
