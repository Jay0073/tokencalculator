# @jay0073/n8n-nodes-tokencalculator

Privacy-first, local token counting and LLM cost comparison for n8n workflows. Measure plain text, source files, PDF documents, DOCX documents, and images without sending workflow content to TokenCalculator servers.

## Operations

- **Count Tokens** — measure one selected model.
- **Estimate Cost** — calculate input, cached-input, and expected output cost.
- **Compare Models** — return side-by-side measurements for selected OpenAI, Anthropic, Google, and DeepSeek models.

The node uses [`@jay0073/tokencalculator-core`](https://www.npmjs.com/package/@jay0073/tokencalculator-core), the same calculation engine developed for the [TokenCalculator.dev web GUI](https://tokencalculator.dev).

## Privacy and accuracy

All extraction and calculation runs inside the n8n process. OpenAI text uses exact local `o200k_base` BPE tokenization. Other providers use deterministic Provider-Calibrated UTF-8 Token Projections where a production tokenizer is not distributed for local use. Images use published provider-family formulas.

## Local installation

No API credentials are required. This release targets self-hosted/community n8n because reliable PDF, DOCX, and image extraction requires local runtime dependencies.

From this monorepo:

```bash
npm run build:core
npm run build:n8n
npm pack --workspace @jay0073/tokencalculator-core
npm pack --workspace @jay0073/n8n-nodes-tokencalculator
```

Install both tarballs in the directory containing your self-hosted n8n installation, then set `N8N_CUSTOM_EXTENSIONS` to the installed package's `dist` directory before starting n8n. In the editor, add **Token Calculator**, select an operation and input source, and execute the workflow.

For registry installation, publish `@jay0073/tokencalculator-core@0.2.0` first. Community-node releases should use the n8n release command so its release checks and provenance workflow are preserved:

```bash
npm publish --workspace @jay0073/tokencalculator-core --access public
npm run release --workspace @jay0073/n8n-nodes-tokencalculator
```

Public releases are created by `.github/workflows/publish-n8n-node.yml`. The workflow uses npm trusted publishing and requests an OpenID Connect identity token, producing the provenance statement required by the n8n Creator Portal. Configure that exact workflow as the package's trusted publisher on npm before dispatching it.
