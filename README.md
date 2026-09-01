# TokenCalculator.dev

Web GUI: [https://tokencalculator.dev](https://tokencalculator.dev)

A privacy-first, browser-based LLM token calculator for OpenAI, Anthropic Claude, Google Gemini, and DeepSeek. It measures text, readable documents, and supported images, then reports token usage, context-window fit, and API cost projections without uploading user content.

## Features

- Live token counts across four providers
- Exact local BPE tokenization for supported OpenAI models
- Deterministic Provider-Calibrated UTF-8 Projections for other tokenizer families
- Client-side TXT, Markdown, code, CSV, JSON, PDF, and DOCX extraction
- Provider image-token formulas where documented
- Context-window overflow analysis and pricing projections
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

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for repository structure, package-specific checks, pull request guidance, and release expectations. User-facing changes are recorded in [`CHANGELOG.md`](CHANGELOG.md).

## Architecture

- Astro static-site generation
- TypeScript
- Tailwind CSS v4
- Web Worker tokenization
- `js-tiktoken` for exact BPE counts on supported models
- Models.dev pricing refresh with a bundled offline fallback

Provider pricing and tokenization behavior can change. Results identify whether they use exact BPE tokenization, a provider-published vision formula, or a deterministic provider-calibrated projection; provider API usage and invoices remain authoritative.

## Companion package

The public `@jay0073/tokencalculator-core` package provides the shared token measurement, cost comparison, image formula, context-window, and workload APIs for Node.js and browser projects. Its source lives in [`packages/tokencalculator-core`](packages/tokencalculator-core).

## n8n community node

`@jay0073/n8n-nodes-tokencalculator` brings local text, PDF, DOCX, source-file, and image measurement into self-hosted n8n workflows. It supports token counting, single-model cost estimation, and multi-model comparisons without sending workflow content to TokenCalculator servers. See [`packages/n8n-nodes-tokencalculator`](packages/n8n-nodes-tokencalculator).
