# TokenCalculator.dev Implementation Plan

## Goal

Ship the approved static, local-only calculator for OpenAI, Anthropic, Google, and DeepSeek without implementing items in `docs/FUTURE_IDEAS.md`.

## Checkpoints

1. **Foundation** — Configure Astro, Tailwind v4, sitemap generation, TypeScript, Vitest, global design tokens, and base metadata.
2. **Calculation domain** — Add typed providers/models, input pricing, context calculations, OpenAI encodings, calibrated estimates, and published vision formulas with unit tests.
3. **Local files** — Read text formats directly; lazily extract text-based DOCX and PDF content; return typed errors for unsupported or unreadable documents.
4. **Calculator** — Build the unified mixed-input composer, zero-click live results, provider summaries, exact token inspection, model detail rows, accuracy labels, context rulers, workload planner, share/export actions, theme, responsive behavior, and worker-based local calculation.
5. **SEO surface** — Generate the universal and four provider pages, methodology/trust pages, visible FAQs, WebApplication/FAQ JSON-LD, sitemap, robots, `llms.txt`, and social assets.
6. **Verification** — Run unit/build/type checks, inspect desktop/mobile pages in a browser, test interaction and uploads, audit accessibility/SEO/network privacy, and request code review.

## Scope guard

Do not add sortable catalog tables, batch pricing, RAG/agent calculators, OCR, accounts, extra providers, or model-specific programmatic pages.
