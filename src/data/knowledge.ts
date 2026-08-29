export interface KnowledgeEntry {
  title:string; description:string; href:string; label:string; published:string; updated:string; readTime:string; kind:'blog'|'docs';
}

export const blogPosts:KnowledgeEntry[] = [
  { title:'Private LLM token counting for enterprise prompts, files, and code', description:'A verifiable browser-local architecture for preflighting confidential AI workloads without uploading their contents to a counting service.', href:'/blog/private-llm-token-counting-enterprise/', label:'Privacy architecture', published:'2026-08-28', updated:'2026-08-28', readTime:'8 min', kind:'blog' },
  { title:'How to calculate tokens in PDFs, DOCX, code, and images', description:'A local, multimodal workflow for measuring the content that actually enters an LLM request—not only pasted text.', href:'/blog/calculate-pdf-docx-code-image-tokens/', label:'Multimodal workflow', published:'2026-08-28', updated:'2026-08-28', readTime:'8 min', kind:'blog' },
  { title:'Image token calculation across OpenAI, Claude, and Gemini', description:'Why image dimensions, detail mode, tiling, patches, and model generation change the input-token result.', href:'/blog/image-token-calculation-openai-claude-gemini/', label:'Provider analysis', published:'2026-08-28', updated:'2026-08-28', readTime:'9 min', kind:'blog' },
  { title:'Why a token count is not the same as an API bill', description:'A technical boundary map for message framing, tools, caching, reasoning, output, and long-context pricing.', href:'/blog/token-count-vs-api-bill/', label:'Cost engineering', published:'2026-08-28', updated:'2026-08-28', readTime:'7 min', kind:'blog' },
];

export const docsPages:KnowledgeEntry[] = [
  { title:'Developer API reference', description:'Free HTTP endpoints, batch and comparison requests, response fields, limits, errors, and the local npm SDK.', href:'/docs/api/', label:'Developer platform', published:'2026-08-28', updated:'2026-08-28', readTime:'Reference', kind:'docs' },
  { title:'Privacy architecture', description:'What remains on-device, what network requests exist, and how browser memory is used.', href:'/docs/privacy-architecture/', label:'Trust boundary', published:'2026-08-28', updated:'2026-08-28', readTime:'Reference', kind:'docs' },
  { title:'Text and source code', description:'Exact local OpenAI BPE counts and provider-family UTF-8 projections.', href:'/docs/text-and-code/', label:'Input pipeline 01', published:'2026-08-28', updated:'2026-08-28', readTime:'Reference', kind:'docs' },
  { title:'PDF, DOCX, and data files', description:'Browser extraction, supported formats, scanned-PDF limits, and combined counts.', href:'/docs/files/', label:'Input pipeline 02', published:'2026-08-28', updated:'2026-08-28', readTime:'Reference', kind:'docs' },
  { title:'Images and vision tokens', description:'Dimension inspection and provider-specific visual-token formulas.', href:'/docs/images/', label:'Input pipeline 03', published:'2026-08-28', updated:'2026-08-28', readTime:'Reference', kind:'docs' },
  { title:'n8n community node', description:'Use the published TokenCalculator node in repeatable document and prompt workflows.', href:'/docs/n8n/', label:'Automation', published:'2026-08-28', updated:'2026-08-28', readTime:'Reference', kind:'docs' },
];
