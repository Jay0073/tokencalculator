export interface ModelConfig {
	id: string; name: string; provider: 'openai'|'anthropic'|'google'|'deepseek';
	contextWindow: number; inputPerMillion: number; cachedInputPerMillion?: number;
	outputPerMillion: number; bytesPerToken: number; vision?: 'openai'|'claude'|'gemini';
}

// <generated-models>
// GENERATED FILE - DO NOT EDIT BY HAND.
// Produced by scripts/sync-models.mjs from https://models.dev/api.json.
// Every rate below comes from that feed. To change which models appear,
// edit scripts/model-policy.json and re-run: npm run sync:models
export const MODELS: readonly ModelConfig[] = [
	{ id:'gpt-6.1-terra', name:'GPT-6.1 Terra', provider:'openai', contextWindow:1_050_000, inputPerMillion:1, cachedInputPerMillion:0.05, outputPerMillion:5, bytesPerToken:4, vision:'openai' },
	{ id:'gpt-6.1-sol', name:'GPT-6.1 Sol', provider:'openai', contextWindow:1_050_000, inputPerMillion:2, cachedInputPerMillion:0.1, outputPerMillion:10, bytesPerToken:4, vision:'openai' },
	{ id:'gpt-6-luna', name:'GPT-6 Luna', provider:'openai', contextWindow:1_050_000, inputPerMillion:0.1, cachedInputPerMillion:0.01, outputPerMillion:0.5, bytesPerToken:4, vision:'openai' },
	{ id:'gpt-6-sol', name:'GPT-6 Sol', provider:'openai', contextWindow:1_050_000, inputPerMillion:2, cachedInputPerMillion:0.2, outputPerMillion:10, bytesPerToken:4, vision:'openai' },
	{ id:'gpt-6-astra', name:'GPT-6 Astra', provider:'openai', contextWindow:1_050_000, inputPerMillion:10, cachedInputPerMillion:1, outputPerMillion:50, bytesPerToken:4, vision:'openai' },
	{ id:'gpt-5.6-luna', name:'GPT-5.6 Luna', provider:'openai', contextWindow:1_050_000, inputPerMillion:0.2, cachedInputPerMillion:0.02, outputPerMillion:1.2, bytesPerToken:4, vision:'openai' },
	{ id:'gpt-5.6-sol', name:'GPT-5.6 Sol', provider:'openai', contextWindow:1_050_000, inputPerMillion:4, cachedInputPerMillion:0.4, outputPerMillion:20, bytesPerToken:4, vision:'openai' },
	{ id:'gpt-5.6-terra', name:'GPT-5.6 Terra', provider:'openai', contextWindow:1_050_000, inputPerMillion:2, cachedInputPerMillion:0.2, outputPerMillion:12, bytesPerToken:4, vision:'openai' },
	{ id:'claude-haiku-5-5', name:'Claude Haiku 5.5', provider:'anthropic', contextWindow:1_000_000, inputPerMillion:0.1, cachedInputPerMillion:0.01, outputPerMillion:0.5, bytesPerToken:2.88, vision:'claude' },
	{ id:'claude-sonnet-5-5', name:'Claude Sonnet 5.5', provider:'anthropic', contextWindow:1_000_000, inputPerMillion:2, cachedInputPerMillion:0.1, outputPerMillion:10, bytesPerToken:2.88, vision:'claude' },
	{ id:'claude-opus-5-5', name:'Claude Opus 5.5', provider:'anthropic', contextWindow:1_000_000, inputPerMillion:4, cachedInputPerMillion:0.2, outputPerMillion:20, bytesPerToken:2.88, vision:'claude' },
	{ id:'claude-fable-5-1', name:'Claude Fable 5.1', provider:'anthropic', contextWindow:1_000_000, inputPerMillion:10, cachedInputPerMillion:0.25, outputPerMillion:50, bytesPerToken:2.88, vision:'claude' },
	{ id:'claude-opus-5', name:'Claude Opus 5', provider:'anthropic', contextWindow:1_000_000, inputPerMillion:5, cachedInputPerMillion:0.5, outputPerMillion:25, bytesPerToken:2.88, vision:'claude' },
	{ id:'claude-sonnet-5', name:'Claude Sonnet 5', provider:'anthropic', contextWindow:1_000_000, inputPerMillion:2, cachedInputPerMillion:0.2, outputPerMillion:10, bytesPerToken:2.88, vision:'claude' },
	{ id:'claude-fable-5', name:'Claude Fable 5', provider:'anthropic', contextWindow:1_000_000, inputPerMillion:10, cachedInputPerMillion:1, outputPerMillion:50, bytesPerToken:2.88, vision:'claude' },
	{ id:'gemini-4-argon', name:'Gemini 4 Argon', provider:'google', contextWindow:1_048_576, inputPerMillion:2, cachedInputPerMillion:0.1, outputPerMillion:10, bytesPerToken:4, vision:'gemini' },
	{ id:'gemini-3.8-flash', name:'Gemini 3.8 Flash', provider:'google', contextWindow:1_048_576, inputPerMillion:0.75, cachedInputPerMillion:0.075, outputPerMillion:3.75, bytesPerToken:4, vision:'gemini' },
	{ id:'gemini-3.5-flash-lite', name:'Gemini 3.5 Flash Lite', provider:'google', contextWindow:1_048_576, inputPerMillion:0.3, cachedInputPerMillion:0.03, outputPerMillion:2.5, bytesPerToken:4, vision:'gemini' },
	{ id:'gemini-3.6-flash', name:'Gemini 3.6 Flash', provider:'google', contextWindow:1_048_576, inputPerMillion:0.75, cachedInputPerMillion:0.075, outputPerMillion:3.75, bytesPerToken:4, vision:'gemini' },
	{ id:'gemini-3.1-flash-lite', name:'Gemini 3.1 Flash Lite', provider:'google', contextWindow:1_048_576, inputPerMillion:0.25, cachedInputPerMillion:0.025, outputPerMillion:1.5, bytesPerToken:4, vision:'gemini' },
	{ id:'gemini-2.5-pro', name:'Gemini 2.5 Pro', provider:'google', contextWindow:1_048_576, inputPerMillion:1.25, cachedInputPerMillion:0.125, outputPerMillion:10, bytesPerToken:4, vision:'gemini' },
	{ id:'deepseek-flash', name:'DeepSeek V4.1 Flash 1017', provider:'deepseek', contextWindow:1_048_576, inputPerMillion:0.15, cachedInputPerMillion:0.003, outputPerMillion:0.6, bytesPerToken:3.85 },
	{ id:'deepseek-v4-pro', name:'DeepSeek V4 Pro', provider:'deepseek', contextWindow:1_048_576, inputPerMillion:0.66, cachedInputPerMillion:0.022, outputPerMillion:1.98, bytesPerToken:3.85 },
];
// </generated-models>

const getModel = (id: string) => {
	const model = MODELS.find((candidate) => candidate.id === id);
	if (!model) throw new RangeError(`Unknown model: ${id}`);
	return model;
};

function imageTokens(width: number, height: number, model: ModelConfig, detail: 'low'|'high') {
	const w=Math.max(1,width), h=Math.max(1,height);
	if (!model.vision) throw new Error(`${model.name} does not support image-token estimates`);
	if (model.vision === 'openai') {
		if (detail === 'low') return { tokens:85, method:'OpenAI low-detail fixed image cost' };
		const fit=Math.min(1,2048/w,2048/h); let rw=w*fit, rh=h*fit; const scale=768/Math.min(rw,rh); rw*=scale; rh*=scale;
		const tiles=Math.ceil(rw/512)*Math.ceil(rh/512); return { tokens:85+170*tiles, method:`OpenAI high-detail formula - ${tiles} tiles` };
	}
	if (model.vision === 'claude') {
		const cap=model.id.includes('haiku')?1568:4784, edge=cap===4784?2576:1568;
		const scale=Math.min(1,edge/w,edge/h,Math.sqrt((cap*28*28)/(w*h)));
		return { tokens:Math.min(cap,Math.ceil(w*scale/28)*Math.ceil(h*scale/28)), method:`Claude 28x28 patch formula - ${cap} token tier` };
	}
	if (w<=384 && h<=384) return { tokens:258, method:'Gemini small-image fixed allocation' };
	const crop=Math.max(1,Math.floor(Math.min(w,h)/1.5)), tiles=Math.ceil(w/crop)*Math.ceil(h/crop);
	return { tokens:tiles*258, method:`Gemini media allocation - ${tiles} tiles` };
}

export async function measureModel(input: { text?:string; image?:{width:number;height:number;detail?:'low'|'high'}; images?:readonly {width:number;height:number;detail?:'low'|'high'}[]; outputTokens?:number; cachedInputTokens?:number }, modelId: string) {
	const model=getModel(modelId), text=input.text??'';
	const textTokens=text ? Math.max(1,Math.ceil(new TextEncoder().encode(text).length/model.bytesPerToken)) : 0;
	const images=[...(input.images??[]),...(input.image?[input.image]:[])];
	const imageMeasurements=images.map((image)=>imageTokens(image.width,image.height,model,image.detail??'high'));
	const inputTokens=textTokens+imageMeasurements.reduce((total,image)=>total+image.tokens,0), outputTokens=Math.max(0,Math.round(input.outputTokens??0));
	const cachedInputTokens=Math.max(0,Math.round(input.cachedInputTokens??0));
	if (cachedInputTokens > inputTokens) throw new RangeError('Cached input tokens cannot exceed input tokens');
	const inputCost=(inputTokens-cachedInputTokens)/1_000_000*model.inputPerMillion;
	const cachedInput=cachedInputTokens/1_000_000*(model.cachedInputPerMillion??model.inputPerMillion);
	const output=outputTokens/1_000_000*model.outputPerMillion;
	return { modelId:model.id, model:model.name, provider:model.provider, inputTokens, outputTokens, accuracy:imageMeasurements.length?'provider-formula':'estimated', method:[text?'Provider-calibrated UTF-8 projection':'No text input',...imageMeasurements.map((image)=>image.method)].filter(Boolean).join(' + '), cost:{input:inputCost,cachedInput,output,total:inputCost+cachedInput+output}, context:{ratio:inputTokens/model.contextWindow,remaining:Math.max(0,model.contextWindow-inputTokens),overContext:inputTokens>model.contextWindow}, rates:{inputPerMillion:model.inputPerMillion,cachedInputPerMillion:model.cachedInputPerMillion,outputPerMillion:model.outputPerMillion,label:'Standard rate'} };
}

export async function compareModels(input: Parameters<typeof measureModel>[0], modelIds: readonly string[]) {
	return Promise.all(modelIds.map((id)=>measureModel(input,id)));
}
