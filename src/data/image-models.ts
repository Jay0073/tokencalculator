/**
 * Image-generation API prices.
 *
 * models.dev has no per-image price field, so these cannot come from the synced catalogue.
 * They are hand-maintained from each provider's own pricing page, and every entry names
 * its source and the date it was checked. `priceBasis` says how firm each number is:
 *
 *   published   - the provider lists a price per image.
 *   calculated  - the provider bills per token; the per-image cost uses the provider's own
 *                 published token count or cost calculator.
 *   estimated   - the provider publishes neither a per-image price nor a token count; the
 *                 figure is a third-party estimate and is labelled as one wherever shown.
 */
export interface ImagePrice {
  /** Size and quality this price applies to. */
  label: string;
  /** USD per generated image, standard processing. */
  usd: number;
  /** USD per image through the provider's batch discount, when one exists. */
  batchUsd?: number;
}

export interface ImageModel {
  id: string;
  name: string;
  lab: string;
  apiId: string;
  released?: string;
  status: 'Generally available' | 'Public preview';
  /** How the provider bills, in one sentence. */
  billing: string;
  /** Price at about 1024x1024, the common comparison point. Two entries when quality varies a lot. */
  standard: ImagePrice[];
  /** Highest resolution or quality the API sells. */
  best: ImagePrice;
  /** The full price ladder, for detail pages. */
  prices: ImagePrice[];
  priceBasis: 'published' | 'calculated' | 'estimated';
  basisNote: string;
  batch: string;
  maxOutput: string;
  editing: string;
  sources: { label: string; url: string }[];
  checked: string;
}

export const IMAGE_PRICES_CHECKED = '2026-10-29';

export const IMAGE_MODELS: ImageModel[] = [
  {
    id: 'gpt-image-2.5',
    name: 'GPT Image 2.5',
    lab: 'OpenAI',
    apiId: 'gpt-image-2.5-flare, gpt-image-2.5-sunburst',
    released: '2026-09-08',
    status: 'Generally available',
    billing: 'Per token: $30 per 1M image output tokens, $5 per 1M text input, $8 per 1M image input. Flare and Sunburst cost the same.',
    standard: [{ label: '1024×1024 · medium', usd: 0.0132 }, { label: '1024×1024 · high', usd: 0.0527 }],
    best: { label: '2880×2880 · max', usd: 0.712 },
    prices: [
      { label: '1024×1024 · low', usd: 0.0059 },
      { label: '1024×1024 · medium', usd: 0.0132 },
      { label: '1024×1024 · high', usd: 0.0527 },
      { label: '1024×1024 · xhigh', usd: 0.0937 },
      { label: '1024×1024 · max', usd: 0.2107 },
      { label: '3840×2160 · high', usd: 0.1 },
      { label: '3840×2160 · max', usd: 0.4 },
      { label: '2880×2880 · max', usd: 0.712 },
    ],
    priceBasis: 'calculated',
    basisNote: 'OpenAI bills image output by the token. Per-image costs use the token counts from OpenAI\'s own image cost calculator, multiplied by $30 per million.',
    batch: 'Not available for GPT Image 2.5.',
    maxOutput: '3840 px on the longest edge. OpenAI marks sizes above 2560×1440 as experimental.',
    editing: 'Input images bill at $8 per 1M tokens. OpenAI does not publish a fixed token count per input image, so read the usage field of each response.',
    sources: [
      { label: 'OpenAI API pricing', url: 'https://developers.openai.com/api/docs/pricing' },
      { label: 'OpenAI image generation guide', url: 'https://developers.openai.com/api/docs/guides/image-generation' },
    ],
    checked: '2026-09-21',
  },
  {
    id: 'nano-banana-2.1',
    name: 'Nano Banana 2.1',
    lab: 'Google',
    apiId: 'gemini-nano-banana-2.1',
    released: '2026-10-06',
    status: 'Generally available',
    billing: 'Per token: $30 per 1M image output tokens, with a fixed token count for each resolution (1,120 tokens at 1K).',
    standard: [{ label: '1K (1024×1024)', usd: 0.0336, batchUsd: 0.0168 }],
    best: { label: '4K (4096×4096)', usd: 0.113, batchUsd: 0.0567 },
    prices: [
      { label: '1K (1024×1024)', usd: 0.0336, batchUsd: 0.0168 },
      { label: '2K (2048×2048)', usd: 0.0504, batchUsd: 0.0252 },
      { label: '4K (4096×4096)', usd: 0.113, batchUsd: 0.0567 },
    ],
    priceBasis: 'published',
    basisNote: 'Google publishes the token count and price for each resolution.',
    batch: 'Half price through the Batch API.',
    maxOutput: '4K (4096×4096).',
    editing: 'Text, image, and video input bill at $1.50 per 1M tokens. Google does not publish one fixed input-image token count for every edit.',
    sources: [
      { label: 'Gemini Nano Banana 2.1 model page', url: 'https://ai.google.dev/gemini-api/docs/models/gemini-nano-banana-2.1' },
      { label: 'Gemini API pricing', url: 'https://ai.google.dev/gemini-api/docs/pricing' },
    ],
    checked: '2026-10-29',
  },
  {
    id: 'nano-banana-2-lite',
    name: 'Nano Banana 2 Lite',
    lab: 'Google',
    apiId: 'gemini-3.1-flash-lite-image',
    status: 'Generally available',
    billing: 'Per token: $30 per 1M image output tokens, 1K output only.',
    standard: [{ label: '1K (1024×1024)', usd: 0.0336, batchUsd: 0.0168 }],
    best: { label: '1K (1024×1024)', usd: 0.0336, batchUsd: 0.0168 },
    prices: [{ label: '1K (1024×1024)', usd: 0.0336, batchUsd: 0.0168 }],
    priceBasis: 'published',
    basisNote: 'Google publishes the price per 1K image.',
    batch: 'Half price through the Batch API.',
    maxOutput: '1K only.',
    editing: 'Input images bill at $0.25 per 1M tokens.',
    sources: [{ label: 'Gemini API pricing', url: 'https://ai.google.dev/gemini-api/docs/pricing' }],
    checked: '2026-09-21',
  },
  {
    id: 'nano-banana-pro',
    name: 'Nano Banana Pro',
    lab: 'Google',
    apiId: 'gemini-3-pro-image',
    status: 'Generally available',
    billing: 'Per token: $120 per 1M image output tokens.',
    standard: [{ label: '1K or 2K', usd: 0.134, batchUsd: 0.067 }],
    best: { label: '4K', usd: 0.24, batchUsd: 0.12 },
    prices: [
      { label: '1K or 2K', usd: 0.134, batchUsd: 0.067 },
      { label: '4K', usd: 0.24, batchUsd: 0.12 },
    ],
    priceBasis: 'published',
    basisNote: 'Google publishes the price for each resolution.',
    batch: 'Half price through the Batch API.',
    maxOutput: '4K.',
    editing: 'Input images cost about $0.0011 each.',
    sources: [{ label: 'Gemini API pricing', url: 'https://ai.google.dev/gemini-api/docs/pricing' }],
    checked: '2026-09-21',
  },
  {
    id: 'grok-imagine-image-2',
    name: 'Grok Imagine Image 2.0',
    lab: 'xAI',
    apiId: 'grok-imagine-image-2.0',
    status: 'Generally available',
    billing: 'Flat price per generated image.',
    standard: [{ label: 'Per image', usd: 0.04 }],
    best: { label: 'Per image', usd: 0.04 },
    prices: [{ label: 'Per image (list price)', usd: 0.04 }],
    priceBasis: 'published',
    basisNote: 'xAI lists $0.04 per image for grok-imagine-image-2.0.',
    batch: 'Supported through the Batch API, billed at the standard rate.',
    maxOutput: 'Not stated on the pricing page.',
    editing: 'Supported. Check xAI\'s pricing page for input-image charges before costing an editing pipeline.',
    sources: [
      { label: 'xAI API pricing', url: 'https://docs.x.ai/developers/pricing' },
      { label: 'xAI model page', url: 'https://docs.x.ai/developers/models/grok-imagine-image-2.0' },
    ],
    checked: '2026-09-21',
  },
  {
    id: 'seedream-5-pro',
    name: 'Seedream 5.0 Pro',
    lab: 'ByteDance',
    apiId: 'dola-seedream-5-0-pro-260628',
    released: '2026-07-08',
    status: 'Generally available',
    billing: 'Flat price per image, set by the pixel count of the output.',
    standard: [{ label: 'Up to 2.61 MP (1K and 1.5K)', usd: 0.045 }],
    best: { label: '2K (above 2.61 MP)', usd: 0.09 },
    prices: [
      { label: 'Up to 2.61 MP (1K and 1.5K)', usd: 0.045 },
      { label: '2K (above 2.61 MP)', usd: 0.09 },
    ],
    priceBasis: 'published',
    basisNote: 'BytePlus ModelArk list price. On fal the same tiers cost $0.0675 and $0.135.',
    batch: 'No batch discount found.',
    maxOutput: '2K.',
    editing: 'The first reference image is free and each extra one costs $0.003. Failed images are not billed.',
    sources: [
      { label: 'BytePlus ModelArk pricing', url: 'https://docs.byteplus.com/en/docs/ModelArk/1099320' },
      { label: 'fal Seedream 5.0 Pro', url: 'https://fal.ai/models/bytedance/seedream/v5/pro/text-to-image' },
    ],
    checked: '2026-09-21',
  },
  {
    id: 'mai-image-2.6',
    name: 'MAI-Image-2.6',
    lab: 'Microsoft',
    apiId: 'MAI-Image-2.6',
    status: 'Public preview',
    billing: 'Per token (text input, image input and image output). Microsoft does not publish how many tokens one image uses.',
    standard: [{ label: '1024×1024', usd: 0.039 }],
    best: { label: '1024×1024 (API maximum)', usd: 0.039 },
    prices: [{ label: '1024×1024 (estimate)', usd: 0.039 }],
    priceBasis: 'estimated',
    basisNote: 'Estimate from third-party trackers, about $38.90 per 1,000 images. Microsoft publishes per-token rates but not the tokens per image.',
    batch: 'None documented.',
    maxOutput: '1,048,576 pixels (the area of 1024×1024), each side at least 768 px.',
    editing: 'Supported through the MAI image edits API. Rate limits are low in preview: 2 to 12 requests per minute.',
    sources: [
      { label: 'Microsoft Foundry: MAI image models', url: 'https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/use-foundry-models-mai-image' },
      { label: 'Microsoft AI announcement', url: 'https://microsoft.ai/news/pushing-the-quality-cost-frontier-with-mai-image-2-6/' },
    ],
    checked: '2026-09-21',
  },
  {
    id: 'mai-image-2.6-flash',
    name: 'MAI-Image-2.6-Flash',
    lab: 'Microsoft',
    apiId: 'MAI-Image-2.6-Flash',
    status: 'Public preview',
    billing: 'Per token, at lower rates than MAI-Image-2.6. Microsoft does not publish how many tokens one image uses.',
    standard: [{ label: '1024×1024', usd: 0.0195 }],
    best: { label: '1024×1024 (API maximum)', usd: 0.0195 },
    prices: [{ label: '1024×1024 (estimate)', usd: 0.0195 }],
    priceBasis: 'estimated',
    basisNote: 'Estimate from third-party trackers, about $19.50 per 1,000 images.',
    batch: 'None documented.',
    maxOutput: '1,048,576 pixels (the area of 1024×1024).',
    editing: 'Supported through the MAI image edits API.',
    sources: [{ label: 'Microsoft Foundry: MAI image models', url: 'https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/use-foundry-models-mai-image' }],
    checked: '2026-09-21',
  },
];

export const getImageModel = (id: string) => {
  const model = IMAGE_MODELS.find((candidate) => candidate.id === id);
  if (!model) throw new Error(`Unknown image model: ${id}`);
  return model;
};

/** Exact list price, never rounded away: $0.0527, $0.04, $0.712. */
export const imageUsd = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;

export const BASIS_LABEL: Record<ImageModel['priceBasis'], string> = {
  published: 'Published per-image price',
  calculated: 'Calculated from per-token price',
  estimated: 'Estimate, not published',
};

/** Image pages, listed on the /compare/ hub and in llms.txt. */
export const IMAGE_PAGES = [
  { href: '/image-generation-api-pricing/', title: 'Image generation API pricing', detail: 'Cost per image for GPT Image 2.5, Nano Banana, Grok Imagine, Seedream and MAI-Image' },
  { href: '/gpt-image-2-5-vs-nano-banana-2-1-cost/', title: 'GPT Image 2.5 vs Nano Banana 2.1', detail: 'OpenAI quality tiers against Google\'s $0.0336 standard and $0.0168 batch 1K image price' },
  { href: '/gpt-image-2-5-vs-grok-imagine-image-2-cost/', title: 'GPT Image 2.5 vs Grok Imagine Image 2.0', detail: 'Quality tiers against a flat $0.04 per image' },
];
