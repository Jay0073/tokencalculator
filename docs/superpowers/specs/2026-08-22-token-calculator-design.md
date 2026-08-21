# TokenCalculator.dev Design

## Purpose

TokenCalculator.dev answers one question: how many input tokens will a text prompt, supported document, or image use for a selected LLM, and what will those input tokens cost?

The application is a free, static, browser-only tool. User content never leaves the device. Launch supports OpenAI, Anthropic, Google, and DeepSeek only.

## Launch scope

### Included

- Paste or type text and receive live results.
- Upload text-readable files such as TXT, Markdown, JSON, CSV, JavaScript, TypeScript, Python, and similar source files.
- Attempt lightweight, client-side extraction from text-based PDF and DOCX files.
- Upload an image and estimate vision-input tokens for models with published rules.
- Select a provider and one current production model.
- Display tokens, word count, character count, UTF-8 byte count, input cost, context-window usage, and overflow state.
- Label every count as `Exact`, `Provider formula`, or `Estimated`.
- Support dark and light themes, keyboard navigation, responsive layouts, and reduced motion.
- Publish a universal calculator and four provider-focused SEO pages.

### Excluded

- Output-token forecasting and workload simulation.
- Multi-model comparison tables.
- Cached-input, batch, RAG, agent, or embedding calculators.
- OCR, scanned-PDF parsing, layout reconstruction, and table extraction.
- Accounts, storage, saved projects, APIs, CLIs, databases, or server-side processing.
- Providers other than OpenAI, Anthropic, Google, and DeepSeek.
- Mass-generated model pages.

Excluded ideas belong in `docs/FUTURE_IDEAS.md` and must not enter the launch implementation without a separate scope decision.

## Accuracy contract

- OpenAI text uses the appropriate local `o200k_base` or `cl100k_base` encoding and is labeled exact.
- Anthropic, Gemini, and DeepSeek text uses a lightweight official tokenizer only when one is practical in-browser. Otherwise it uses a documented calibrated estimate.
- Vision-capable models use their provider's published image dimension, patch, tile, detail, and cap rules.
- Models without documented image support reject image calculation rather than inventing a result.
- Uploaded documents are converted to plain text locally and then counted through the selected model strategy.
- PDF and DOCX support remains only if extraction is reliable and does not materially damage initial load, browser stability, or maintainability.
- Pricing entries contain an official source URL and verification date.
- The interface never describes an estimated result as exact.

## Experience

The desktop calculator uses two stable columns: input on the left and results on the right. Mobile stacks input above results. The layout must not move as counts update.

The input panel contains the provider/model selector, text/file/image modes, text area or drop zone, file status, and clear action. The results panel contains the primary token count, accuracy badge, secondary text metrics, context gauge, input cost, and a short calculation explanation.

Image processing reads only local file metadata and dimensions. Document errors distinguish unsupported, encrypted, scanned, oversized, and malformed files. Empty input produces a neutral zero state rather than an error.

## Architecture

- Astro static-site generation
- TypeScript
- Tailwind CSS v4
- Minimal framework-free browser scripts
- A Web Worker for expensive tokenization or extraction
- Lazy-loaded tokenizer and document dependencies
- Cloudflare Pages deployment
- No runtime backend or API keys

Processing flow:

1. Detect text, document, or image input.
2. Extract plain text or image dimensions locally.
3. Resolve the selected model and counting strategy.
4. Calculate the token estimate and accuracy classification.
5. Calculate input cost and context-window utilization.
6. Return a typed result or typed user-facing error.
7. Render without changing page geometry.

## Module boundaries

```text
public/
  icons/ social/ robots.txt llms.txt site.webmanifest
src/
  components/
    calculator/ seo/ site/
  data/
    models.ts providers.ts pricing-sources.ts
  domain/
    models.ts calculation.ts results.ts
  engines/
    tokenizers/ vision/ documents/ pricing/
  workers/
    calculator.worker.ts
  pages/
    index.astro
    openai-token-counter.astro
    claude-token-counter.astro
    gemini-token-counter.astro
    deepseek-token-counter.astro
    about.astro methodology.astro privacy-policy.astro terms.astro contact.astro
  layouts/ styles/ utils/
tests/
  tokenizers/ vision/ documents/ pricing/
docs/
  FUTURE_IDEAS.md PRICING_MAINTENANCE.md
```

`data` stores facts that change, `domain` defines stable contracts, and `engines` performs calculations. UI components consume domain results and do not contain provider formulas. This permits adding providers and replacing heuristics without restructuring pages.

## Model registry

Each model record includes its stable ID, display name, provider, status, supported modalities, tokenizer strategy, accuracy classification, context window, maximum output, input price per million, official pricing source, and verification date. Optional strategy-specific configuration holds cache-independent vision rules or tokenizer encoding.

Only a small curated set of current production models appears at launch. Deprecated models are not shown.

## SEO

Launch routes are `/`, `/openai-token-counter`, `/claude-token-counter`, `/gemini-token-counter`, and `/deepseek-token-counter`.

Every calculator page has a unique title, description, H1, canonical URL, social metadata, visible provider-specific methodology, visible FAQ, WebApplication structured data, matching FAQ structured data, internal links, official pricing sources, and last-verified dates. Astro generates the sitemap. The production host redirects or blocks the Cloudflare preview hostname to avoid duplicate indexing.

## Error handling

- Empty input: zero state.
- Unsupported extension: explain supported formats.
- Oversized input: stop before parsing and explain the local limit.
- Encrypted or scanned PDF: explain that OCR is not supported.
- Failed DOCX/PDF extraction: preserve the existing input and show a recoverable error.
- Unsupported image/model combination: request a vision-capable model.
- Worker failure: recover with a concise error and allow retry.
- Context overflow: show the count and cost but mark the request as exceeding the selected model limit.

## Testing and acceptance

- Unit tests cover pricing arithmetic, context boundaries, every tokenizer strategy, and published vision-rule examples.
- Fixture tests cover supported text files, a normal PDF/DOCX, encrypted or malformed documents, Unicode, code, JSON, empty input, and large input.
- Browser tests cover typing, model switching, uploads, URL-loaded provider presets, theme persistence, keyboard use, and mobile layout.
- OpenAI exact counts are checked against known tokenizer fixtures.
- Estimated strategies are tested for deterministic behavior and honest labels, not claimed exactness.
- No user content appears in network requests.
- The initial page remains static and useful without calculator JavaScript.
- Core pages have no unintended horizontal overflow or layout shift.

## Delivery sequence

1. Foundation, design tokens, layouts, and static metadata.
2. Typed provider/model registry and pricing engine.
3. Text counting strategies and worker boundary.
4. Calculator interface, metrics, cost, and context gauge.
5. Text-readable uploads.
6. Provider image formulas.
7. Conditional PDF and DOCX extraction.
8. Provider pages, methodology, FAQ, and trust pages.
9. Unit, fixture, browser, accessibility, performance, and privacy verification.
10. Cloudflare deployment configuration and canonical-host verification.

## Launch condition

The product is ready when a user can select one of the four providers, paste text or upload a supported local file, receive an honestly labeled token count and input cost, understand context-window fit, and verify that their content was not transmitted. Features in `FUTURE_IDEAS.md` are not launch blockers.
