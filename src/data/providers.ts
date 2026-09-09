import type { ProviderId } from '../domain/models';

// Keys match the models.dev provider keys so the generated catalogue needs no mapping.
export const PROVIDERS: Record<ProviderId, { name: string; short: string }> = {
  openai: { name: 'OpenAI', short: 'OAI' },
  anthropic: { name: 'Anthropic', short: 'ANT' },
  google: { name: 'Google', short: 'GOO' },
  deepseek: { name: 'DeepSeek', short: 'DSK' },
  alibaba: { name: 'Qwen', short: 'QWN' },
  moonshotai: { name: 'Moonshot Kimi', short: 'KMI' },
  xai: { name: 'xAI Grok', short: 'XAI' },
  zai: { name: 'Z.ai GLM', short: 'GLM' },
  meta: { name: 'Meta', short: 'MET' },
};
