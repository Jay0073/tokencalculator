# @jay0073/n8n-nodes-tokencalculator

Privacy-first, local token counting and LLM cost comparison for n8n workflows. Measure plain text, UTF-8 text and source-code files, and PNG, JPEG, GIF, or WebP images without sending workflow content to TokenCalculator servers.

## Operations

- **Count Tokens** — measure one selected model.
- **Estimate Cost** — calculate input, cached-input, and expected output cost.
- **Compare Models** — return side-by-side measurements for selected OpenAI, Anthropic, Google, and DeepSeek models.

The node contains its calculation engine so it can meet n8n Cloud's requirement that verified community nodes have no runtime dependencies.

## Privacy and accuracy

All extraction and calculation runs inside the n8n process. Text counts use deterministic provider-calibrated UTF-8 projections. Images use published provider-family formulas.

## Local installation

No API credentials or runtime dependencies are required.

From this monorepo:

```bash
npm run build:n8n
npm pack --workspace @jay0073/n8n-nodes-tokencalculator
```

Install the tarball in the directory containing your self-hosted n8n installation, then set `N8N_CUSTOM_EXTENSIONS` to the installed package's `dist` directory before starting n8n. In the editor, add **Token Calculator**, select an operation and input source, and execute the workflow.

Community-node releases should use the n8n release command so its release checks and provenance workflow are preserved:

```bash
npm run release --workspace @jay0073/n8n-nodes-tokencalculator
```

Public releases are created by `.github/workflows/publish-n8n-node.yml`. The workflow uses npm trusted publishing and requests an OpenID Connect identity token, producing the provenance statement required by the n8n Creator Portal. Configure that exact workflow as the package's trusted publisher on npm before dispatching it.
