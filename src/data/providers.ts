import type { ProviderId } from '../domain/models';

export const PROVIDERS: Record<ProviderId, { name: string; short: string }> = {
  openai: { name: 'OpenAI', short: 'OAI' },
  anthropic: { name: 'Anthropic', short: 'ANT' },
  google: { name: 'Google', short: 'GOO' },
  deepseek: { name: 'DeepSeek', short: 'DSK' },
};
