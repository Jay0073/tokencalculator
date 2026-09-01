import { PieceAuth, createAction } from '@activepieces/pieces-framework';
import { measureModel } from '../calculator';
import { prepareInput } from '../input';
import { inputProperties, modelProperty } from '../properties';

export const countTokensAction = createAction({
  name: 'count_tokens',
  auth: PieceAuth.None(),
  requireAuth: false,
  displayName: 'Count Tokens',
  description: 'Count tokens for mapped text, a supported file, or an image without sending content to an external service.',
  props: { ...inputProperties, model: modelProperty },
  async run({ propsValue }) {
    const prepared = prepareInput({ text: propsValue.text, files: readFiles(propsValue.files), imageDetail: propsValue.imageDetail ?? 'high' });
    const result = await measureModel(prepared.input, propsValue.model ?? 'gpt-5.6-terra');
    return { operation: 'count_tokens', privacy: 'Processed inside the Activepieces runtime; no content is transmitted to TokenCalculator.dev.', source: prepared.source, result };
  },
});

function readFiles(value: unknown[] | undefined) {
  return (value ?? []).flatMap((row) => typeof row === 'object' && row !== null && 'file' in row ? [row.file] : []).filter((file): file is import('@activepieces/pieces-framework').ApFile => file instanceof Object && 'data' in file && 'filename' in file);
}
