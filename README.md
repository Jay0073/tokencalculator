# TokenCalculator.dev

Web GUI: [https://tokencalculator.dev](https://tokencalculator.dev)

A browser-only LLM token calculator for OpenAI, Anthropic Claude, Google Gemini, and DeepSeek. It measures text, readable documents, and supported images, then reports token usage, context-window fit, and API cost estimates.

## Features

- Live token counts across four providers
- Exact local BPE counting for supported OpenAI models
- Clearly labeled calibrated estimates for other provider families
- Client-side TXT, Markdown, code, CSV, JSON, PDF, and DOCX extraction
- Provider image-token formulas where documented
- Context overflow warnings and pricing estimates
- Static provider-specific SEO pages
- No prompt or uploaded-file storage

## Development

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm test
npm run build
```

## Architecture

- Astro static-site generation
- TypeScript
- Tailwind CSS v4
- Web Worker tokenization
- `js-tiktoken` for supported exact BPE counts
- Models.dev pricing refresh with a bundled offline fallback

Provider pricing and tokenization behavior can change. Results identify whether they are exact, based on a provider formula, or estimated; provider API usage and invoices remain authoritative.

## Companion package

The public `@jay0073/tokencalculator-core` package provides dependency-free token-cost and workload math for Node.js and browser projects. Its source lives in [`packages/tokencalculator-core`](packages/tokencalculator-core).
