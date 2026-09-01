import { Property } from '@activepieces/pieces-framework';
import { MODELS } from './calculator';

const modelOptions = MODELS.map((model) => ({ label: `${model.name} — ${model.provider}`, value: model.id }));

export const inputProperties = {
  text: Property.LongText({ displayName: 'Text', description: 'Text, prompt, or mapped value to measure. Provide text, a file, or both.', required: false }),
  files: Property.Array({ displayName: 'Files', description: 'Optional UTF-8 text/source files or PNG, JPEG, GIF, or WebP images (maximum 10 MB each). Add one row per file.', required: false, properties: { file: Property.File({ displayName: 'File', required: true }) } }),
  imageDetail: Property.StaticDropdown<'low' | 'high'>({ displayName: 'Image Detail', description: 'OpenAI low detail uses the fixed low-detail token allocation. Other model families use their published image formula.', required: true, defaultValue: 'high', options: { options: [{ label: 'High', value: 'high' }, { label: 'Low', value: 'low' }] } }),
};

export const modelProperty = Property.StaticDropdown<string>({ displayName: 'Model', required: true, defaultValue: 'gpt-5.6-terra', options: { options: modelOptions } });

export const modelsProperty = Property.StaticMultiSelectDropdown<string>({ displayName: 'Models', description: 'Models to include in the comparison.', required: true, defaultValue: ['gpt-5.6-terra', 'claude-sonnet-5', 'gemini-3.1-flash-lite', 'deepseek-v4-flash'], options: { options: modelOptions } });

export const outputTokensProperty = Property.Number({ displayName: 'Expected Output Tokens', description: 'Expected generated tokens used for the cost estimate.', required: false, defaultValue: 0 });

export const cachedInputTokensProperty = Property.Number({ displayName: 'Cached Input Tokens', description: 'Input tokens billed at the model cached-input rate.', required: false, defaultValue: 0 });
