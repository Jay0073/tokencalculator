import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { MODELS, compareModels, measureModel } from './calculator.js';
import { extractBinaryInput, resolveBinaryPropertyNames } from './extractInput.js';

const mainConnection = 'main' as NodeConnectionType;

const modelOptions = MODELS.map((model) => ({ name: `${model.name} — ${model.provider}`, value: model.id }));

export class TokenCalculator implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Token Calculator',
		name: 'tokenCalculator',
		icon: { light: 'file:tokenCalculator.svg', dark: 'file:tokenCalculator.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Count tokens and compare LLM costs locally for text, code files, and images',
		defaults: { name: 'Token Calculator' },
		inputs: [mainConnection],
		outputs: [mainConnection],
		usableAsTool: true,
		properties: [
			{ displayName:'Operation', name:'operation', type:'options', noDataExpression:true, default:'count', options:[
				{ name:'Count Tokens', value:'count', action:'Count tokens locally' },
				{ name:'Estimate Cost', value:'cost', action:'Estimate model cost locally' },
				{ name:'Compare Models', value:'compare', action:'Compare models locally' },
			] },
			{ displayName:'Input Source', name:'source', type:'options', default:'text', options:[
				{ name:'Text', value:'text' }, { name:'Binary File', value:'binary' }, { name:'Text and Binary File', value:'both' },
			] },
			{ displayName:'Text', name:'text', type:'string', typeOptions:{ rows:5 }, default:'={{ $json.text }}', displayOptions:{ show:{ source:['text','both'] } }, description:'Text, prompt, or expression to measure' },
			{ displayName:'Binary Properties', name:'binaryProperty', type:'string', default:'*', displayOptions:{ show:{ source:['binary','both'] } }, description:'Binary property names separated by commas. Use uploads* for every file from a multi-file form field, or * for all incoming files.' },
			{ displayName:'Model', name:'modelId', type:'options', default:'gpt-5.6-terra', options:modelOptions, displayOptions:{ show:{ operation:['count','cost'] } } },
			{ displayName:'Models', name:'modelIds', type:'multiOptions', default:['gpt-5.6-terra','claude-sonnet-5','gemini-3.1-flash-lite','deepseek-v4-flash'], options:modelOptions, displayOptions:{ show:{ operation:['compare'] } }, description:'Models included in the comparison' },
			{ displayName:'Expected Output Tokens', name:'outputTokens', type:'number', default:0, typeOptions:{ minValue:0 }, displayOptions:{ show:{ operation:['cost','compare'] } } },
			{ displayName:'Cached Input Tokens', name:'cachedInputTokens', type:'number', default:0, typeOptions:{ minValue:0 }, displayOptions:{ show:{ operation:['cost'] } } },
			{ displayName:'Image Detail', name:'imageDetail', type:'options', default:'high', options:[{name:'High',value:'high'},{name:'Low (OpenAI)',value:'low'}], displayOptions:{ show:{ source:['binary','both'] } } },
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items=this.getInputData(); const output: INodeExecutionData[]=[];
		for(let itemIndex=0;itemIndex<items.length;itemIndex+=1) {
			try {
				const operation=this.getNodeParameter('operation',itemIndex) as string;
				const source=this.getNodeParameter('source',itemIndex) as string;
				let text=source==='text'||source==='both'?this.getNodeParameter('text',itemIndex,'') as string:'';
				const images: {width:number;height:number}[]=[];
				const files: {name:string;mimeType?:string;bytes:number;extraction:string;binaryProperty:string}[]=[];
				if(source==='binary'||source==='both') {
					const selector=this.getNodeParameter('binaryProperty',itemIndex,'*') as string;
					const binaryData=items[itemIndex].binary??{};
					const properties=resolveBinaryPropertyNames(binaryData,selector);
					for(const property of properties) {
						const metadata=binaryData[property];
						const buffer=await this.helpers.getBinaryDataBuffer(itemIndex,property);
						const binary=await extractBinaryInput(buffer,metadata.fileName,metadata.mimeType);
						text=[text,binary.text].filter(Boolean).join('\n\n');
						if(binary.image) images.push(binary.image);
						if(binary.file) files.push({...binary.file,binaryProperty:property});
					}
				}
				const imageDetail=this.getNodeParameter('imageDetail',itemIndex,'high') as 'low'|'high';
				const input={text,images:images.map((image)=>({...image,detail:imageDetail})),outputTokens:operation==='count'?0:this.getNodeParameter('outputTokens',itemIndex,0) as number,cachedInputTokens:operation==='cost'?this.getNodeParameter('cachedInputTokens',itemIndex,0) as number:0};
				const result=operation==='compare'
					? await compareModels(input,this.getNodeParameter('modelIds',itemIndex) as string[])
					: await measureModel(input,this.getNodeParameter('modelId',itemIndex) as string);
				output.push({json:{operation,privacy:'Processed locally inside the n8n runtime; no content transmitted',source:{characters:text.length,files},result},pairedItem:{item:itemIndex}});
			} catch(error) {
				if(this.continueOnFail()) output.push({json:{error:error instanceof Error?error.message:String(error)},pairedItem:{item:itemIndex}});
				else throw new NodeOperationError(this.getNode(), error as Error, { itemIndex });
			}
		}
		return [output];
	}
}
