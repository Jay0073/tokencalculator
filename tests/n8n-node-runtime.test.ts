import { describe, expect, it } from 'vitest';
import { TokenCalculator } from '../packages/n8n-nodes-tokencalculator/nodes/TokenCalculator/TokenCalculator.node';

describe('Token Calculator n8n node', () => {
	it('exposes the three local operations', () => {
		const node = new TokenCalculator();
		const operation = node.description.properties.find((property) => property.name === 'operation');
		expect(operation?.options?.map((option) => 'value' in option ? option.value : undefined)).toEqual([
			'count',
			'cost',
			'compare',
		]);
	});

	it('executes a text token-count item without a network request', async () => {
		const node = new TokenCalculator();
		const parameters: Record<string, unknown> = {
			operation: 'count',
			source: 'text',
			text: 'TokenCalculator measures prompts and uploaded files locally.',
			modelId: 'gpt-5.6-terra',
		};
		const context = {
			getInputData: () => [{ json: {} }],
			getNodeParameter: (name: string, _itemIndex: number, fallback?: unknown) => parameters[name] ?? fallback,
			getNode: () => ({ name: 'Token Calculator', type: 'tokenCalculator', typeVersion: 1, position: [0, 0] }),
			continueOnFail: () => false,
		};

		const [items] = await node.execute.call(context as never);
		const result = items[0].json.result as { modelId: string; inputTokens: number };
		expect(result.modelId).toBe('gpt-5.6-terra');
		expect(result.inputTokens).toBeGreaterThan(0);
		expect(items[0].json.privacy).toContain('Processed locally');
	});

	it('combines fixed text and a binary text file exactly once', async () => {
		const node = new TokenCalculator();
		const parameters: Record<string, unknown> = {
			operation: 'count',
			source: 'both',
			text: 'Prompt text',
			binaryProperty: 'data',
			modelId: 'gpt-5.6-terra',
			imageDetail: 'high',
		};
		const context = {
			getInputData: () => [{
				json: {},
				binary: { data: { fileName: 'notes.txt', mimeType: 'text/plain' } },
			}],
			getNodeParameter: (name: string, _itemIndex: number, fallback?: unknown) => parameters[name] ?? fallback,
			getNode: () => ({ name: 'Token Calculator', type: 'tokenCalculator', typeVersion: 1, position: [0, 0] }),
			continueOnFail: () => false,
			helpers: { getBinaryDataBuffer: async () => Buffer.from('File text') },
		};

		const [items] = await node.execute.call(context as never);
		expect(items[0].json.source).toMatchObject({ characters: 'Prompt text\n\nFile text'.length });
	});
});
