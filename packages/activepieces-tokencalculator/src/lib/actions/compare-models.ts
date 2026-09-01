import { PieceAuth, createAction } from '@activepieces/pieces-framework';
import { compareModels } from '../calculator';
import { prepareInput } from '../input';
import { inputProperties, modelsProperty, outputTokensProperty } from '../properties';

export const compareModelsAction = createAction({
  name: 'compare_models',
  auth: PieceAuth.None(),
  requireAuth: false,
  displayName: 'Compare Models',
  description: 'Compare token counts and estimated costs across selected OpenAI, Anthropic, Google, and DeepSeek models.',
  props: { ...inputProperties, models: modelsProperty, expectedOutputTokens: outputTokensProperty },
  async run({ propsValue }) {
    const models = propsValue.models ?? [];
    if (models.length === 0) throw new Error('Select at least one model.');
    const prepared = prepareInput({ text: propsValue.text, files: readFiles(propsValue.files), imageDetail: propsValue.imageDetail ?? 'high', outputTokens: propsValue.expectedOutputTokens });
    const results = await compareModels(prepared.input, models);
    const cheapest = results.reduce((best, candidate) => candidate.cost.total < best.cost.total ? candidate : best);
    const lowestTokenCount = results.reduce((best, candidate) => candidate.inputTokens < best.inputTokens ? candidate : best);
    return { operation: 'compare_models', privacy: 'Processed inside the Activepieces runtime; no content is transmitted to TokenCalculator.dev.', currency: 'USD', source: prepared.source, cheapestModel: { id: cheapest.modelId, name: cheapest.model, totalCost: cheapest.cost.total }, lowestTokenCount: { id: lowestTokenCount.modelId, name: lowestTokenCount.model, inputTokens: lowestTokenCount.inputTokens }, results };
  },
});

function readFiles(value: unknown[] | undefined) {
  return (value ?? []).flatMap((row) => typeof row === 'object' && row !== null && 'file' in row ? [row.file] : []).filter((file): file is import('@activepieces/pieces-framework').ApFile => file instanceof Object && 'data' in file && 'filename' in file);
}
