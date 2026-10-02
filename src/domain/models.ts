/**
 * Provider keys match the top-level keys in the models.dev catalogue, so the
 * generated catalogue can be produced without a translation table.
 */
export type ProviderId =
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'deepseek'
  | 'alibaba'
  | 'moonshotai'
  | 'xai'
  | 'zai'
  | 'meta';

export type Accuracy = 'exact' | 'provider-formula' | 'estimated';

export type TokenizerStrategy =
  | 'o200k_base'
  | 'cl100k_base'
  /** Claude Sonnet 4.6 and earlier. */
  | 'claude-estimate'
  /** Claude 4.7 and later: Anthropic documents ~30% more tokens for the same text. */
  | 'claude-47-estimate'
  | 'gemini-estimate'
  | 'deepseek-estimate'
  | 'qwen-estimate'
  | 'kimi-estimate'
  | 'grok-estimate'
  | 'glm-estimate'
  | 'llama-estimate';

export type VisionStrategy = 'openai-tiles' | 'claude-patches' | 'gemini-tiles';

/**
 * A service tier multiplies every token price of a model. Providers now sell the same
 * model at several speeds and several prices, so a single rate no longer describes a bill.
 */
export interface ServiceTier {
  id: string;
  label: string;
  /** Multiplier on every token category, relative to the standard price. */
  multiplier: number;
  /** Model ids this tier applies to. Undefined means every model from that provider. */
  appliesTo?: string[];
  note: string;
}

export interface PricingTier {
  aboveInputTokens: number;
  inputPerMillion: number;
  cachedInputPerMillion?: number;
  /** Price of writing a prefix into the cache, where the provider charges for it. */
  cacheWritePerMillion?: number;
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
  /**
   * Price of writing a prefix into the cache. OpenAI charges 1.25x input on GPT-5.6 and
   * later; Anthropic charges 1.25x (5 minute) or 2x (1 hour). Undefined means the
   * provider does not publish a separate write price.
   */
  cacheWritePerMillion?: number;
  outputPerMillion: number;
  pricingTiers?: PricingTier[];
  vision?: VisionStrategy;
  pricingUrl: string;
  /**
   * Set only when models.dev disagreed with the provider and the rates were corrected
   * from this official page (see "corrections" in scripts/model-policy.json). The
   * browser's live refresh must not overwrite a corrected model with the upstream rate.
   */
  rateSource?: string;
  /** Upstream launch date, used to sort and to surface how current a model is. */
  releaseDate?: string;
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
