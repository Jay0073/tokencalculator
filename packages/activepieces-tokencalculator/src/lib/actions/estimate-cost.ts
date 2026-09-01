import { PieceAuth, createAction } from '@activepieces/pieces-framework';
import { measureModel } from '../calculator';
import { prepareInput } from '../input';
import { cachedInputTokensProperty, inputProperties, modelProperty, outputTokensProperty } from '../properties';

export const estimateCostAction = createAction({
  name: 'estimate_cost',
  auth: PieceAuth.None(),
  requireAuth: false,
  displayName: 'Estimate Cost',
  description: 'Estimate input, cached-input, and expected output cost for one model.',
  props: { ...inputProperties, model: modelProperty, expectedOutputTokens: outputTokensProperty, cachedInputTokens: cachedInputTokensProperty },
  async run({ propsValue }) {
    const prepared = prepareInput({ text: propsValue.text, files: readFiles(propsValue.files), imageDetail: propsValue.imageDetail ?? 'high', outputTokens: propsValue.expectedOutputTokens, cachedInputTokens: propsValue.cachedInputTokens });
    const result = await measureModel(prepared.input, propsValue.model ?? 'gpt-5.6-terra');
    return { operation: 'estimate_cost', privacy: 'Processed inside the Activepieces runtime; no content is transmitted to TokenCalculator.dev.', currency: 'USD', source: prepared.source, result };
  },
});

function readFiles(value: unknown[] | undefined) {
  return (value ?? []).flatMap((row) => typeof row === 'object' && row !== null && 'file' in row ? [row.file] : []).filter((file): file is import('@activepieces/pieces-framework').ApFile => file instanceof Object && 'data' in file && 'filename' in file);
}
