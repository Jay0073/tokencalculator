# Token Calculator Zapier integration handoff

Status: planned and researched on 2026-09-01. Implementation is intentionally deferred while the Activepieces integration is built first.

## Product decision

Build a private Zapier CLI integration that performs calculations locally inside Zapier by depending on `@jay0073/tokencalculator-core`. It needs no TokenCalculator account, API key, or hosted TokenCalculator service.

The clearest product shape is three actions:

1. **Count Tokens** — count text and supported file/image inputs for one model.
2. **Estimate Cost** — calculate input, cached-input, output, and total estimated costs for one model.
3. **Compare Models** — calculate comparable token and cost results for several selected models.

Three actions make the integration easier to understand and discover, but Zapier requires a live Zap for every visible action during publishing checks. If tester recruitment becomes the priority, a single combined action is the simpler review path.

## Current Zapier CLI baseline

- Zapier CLI version researched: `18.5.1`.
- Runtime: Node.js 22.
- Use the `zapier-platform` executable; the older `zapier` executable is deprecated.
- Prefer TypeScript and ESM with `defineApp`, `defineCreate`, and `defineInputFields`.
- Initial private deployment flow:

```bash
npm install --global zapier-platform-cli
zapier-platform login
zapier-platform init
zapier-platform register "Token Calculator"
zapier-platform push
```

## Proposed package layout

```text
packages/zapier-tokencalculator/
  src/index.ts
  src/creates/count-tokens.ts
  src/creates/estimate-cost.ts
  src/creates/compare-models.ts
  src/fields/
  src/files/
  src/output/
  test/
  package.json
  tsconfig.json
  README.md
```

## Action contracts

### Count Tokens

Inputs:

- `text` — optional dynamic text.
- `file` — optional Zapier file input.
- `model` — required model choice.
- `image_detail` — low or high, when the file is an image.

Require at least one of `text` or `file`.

Outputs:

- Model name and ID, provider, and accuracy/method.
- Input tokens, expected output tokens, and context-window usage.
- Separate text and image/file metadata where practical.
- A privacy note confirming that calculation occurs in the Zapier action runtime.

### Estimate Cost

Inputs:

- `text` and/or `file`.
- `model`.
- `expected_output_tokens`.
- `cached_input_tokens`.
- `image_detail`.

Outputs:

- Input, output, and cached input token counts.
- Input, cached-input, output, and total estimated USD cost.
- Model rates, pricing tier, and context-window usage.

### Compare Models

Inputs:

- `text` and/or `file`.
- Selected model IDs.
- `expected_output_tokens`.
- `image_detail`.

Outputs:

- One line item per model.
- Cheapest model and lowest calculated token count.
- Compact summaries suitable for Google Sheets, Slack, and later Zap steps.

## File handling

Zapier file fields may provide a file object or URL-like string. The action should download the temporary file, enforce a conservative size limit, and process it within Zapier.

First-release text/source extensions:

```text
txt md markdown json csv js jsx ts tsx py go rs java c cpp h hpp
css html xml yaml yml toml sql sh log
```

First-release image extensions:

```text
png jpg jpeg gif webp
```

PDF, DOCX, audio, and video are deliberately out of scope for the first version. For images, extract dimensions and pass them to the core package's provider formula. Never transmit content to TokenCalculator.dev.

## Validation and tests

Cover these cases before deployment:

- Plain dynamic text.
- Empty input rejection.
- Text/source file.
- PNG and JPEG files.
- Unsupported or malformed file.
- Cost estimation, including cached and expected output tokens.
- Multi-model comparison.
- Stable output schema and representative sample data.
- Node.js 22 compatibility.

Zapier CLI checks:

```bash
zapier-platform test
zapier-platform validate
zapier-platform invoke
```

## Useful private-test Zaps

1. Schedule → Count Tokens → Google Sheets.
2. Google Drive new file → Estimate Cost → Slack.
3. Form submission → Compare Models → Google Sheets.

## Zapier platform and publishing checklist

1. Accept the Zapier Developer Terms and create/access a developer account.
2. If the account uses SSO, configure a deploy key for CLI authentication.
3. Log in, initialize, register, and push the integration with the CLI commands above.
4. In the Platform UI, add branding:
   - Square transparent RGBA PNG, at least 256×256.
   - Homepage: `https://tokencalculator.dev`.
   - An appropriate category.
   - Public support and documentation URLs.
   - Suggested description: “Token Calculator is a privacy-first tool for counting LLM tokens and comparing estimated model costs.”
5. Ensure an admin team member uses an email address matching the homepage domain, such as `@tokencalculator.dev`; a Gmail address does not satisfy this check.
6. Invite at least two additional testers. The researched automated checks require three users with live Zaps, one live Zap for every visible action, and retained successful runs.
7. Publish a help page covering actions, supported files, privacy, examples, errors, limits, and the fact that non-OpenAI counts and all costs are estimates where applicable.
8. In the Platform UI, open **Publish**, complete the form, and select **Submit for Review**.
9. Review is generally expected within roughly a week. An approved integration enters a 90-day beta before becoming fully public.

## Official references

- [Zapier CLI overview](https://docs.zapier.com/integrations/build-cli/overview.md)
- [TypeScript integrations](https://docs.zapier.com/integrations/build-cli/typescript-integrations.md)
- [Input fields](https://docs.zapier.com/integrations/build-cli/input-fields.md)
- [Testing and debugging](https://docs.zapier.com/integrations/build-cli/testing-and-debugging.md)
- [CLI integration branding](https://docs.zapier.com/integrations/publish/branding-cli.md)
- [Integration checks reference](https://docs.zapier.com/integrations/publish/integration-checks-reference.md)
- [Publishing a public integration](https://docs.zapier.com/integrations/publish/public-integration.md)
- [Publishing requirements](https://docs.zapier.com/integrations/publish/integration-publishing-requirements.md)

## Resume point

When work returns to Zapier, begin by scaffolding `packages/zapier-tokencalculator`, implementing shared input/file/output helpers, then build **Count Tokens** end-to-end before adding the two cost-oriented actions.
