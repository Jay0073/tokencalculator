import { PieceAuth, createPiece } from '@activepieces/pieces-framework';
import { compareModelsAction } from './lib/actions/compare-models';
import { countTokensAction } from './lib/actions/count-tokens';
import { estimateCostAction } from './lib/actions/estimate-cost';

export const tokenCalculator = createPiece({
  displayName: 'Token Calculator',
  description: 'Count LLM tokens and compare estimated model costs without sending content to an external service.',
  auth: PieceAuth.None(),
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://tokencalculator.dev/favicon.svg',
  authors: ['Jay0073'],
  actions: [countTokensAction, estimateCostAction, compareModelsAction],
  triggers: [],
});
