# Contributing to TokenCalculator.dev

Thanks for helping improve TokenCalculator.dev. Contributions can cover the website, calculation engine, tests, documentation, provider data, n8n node, or Activepieces piece.

## Before you begin

- Search [existing issues](https://github.com/Jay0073/tokencalculator/issues) before opening a duplicate.
- Open an issue before a large architectural change, a new provider integration, or a change to public calculation behavior.
- Never include API keys, private prompts, uploaded files, npm tokens, or other secrets in an issue, fixture, screenshot, or commit.
- Keep calculation claims precise. Provider API usage and invoices are authoritative when a proprietary tokenizer is unavailable.

## Local setup

Requirements:

- Node.js 20 or newer. Node.js 22 is recommended and is used by the publishing workflow.
- npm, using the lockfile committed to this repository.

Clone the repository and install dependencies:

```bash
git clone https://github.com/Jay0073/tokencalculator.git
cd tokencalculator
npm ci
npm run dev
```

The Astro development server prints the local URL when it starts.

## Repository structure

| Path | Responsibility |
| --- | --- |
| `src/` | Astro pages, components, client code, content data, and styles. |
| `worker/` | Cloudflare Worker entry point and API behavior. |
| `tests/` | Site, calculation, API, and integration tests. |
| `packages/tokencalculator-core/` | Framework-independent token and cost calculation package. |
| `packages/n8n-nodes-tokencalculator/` | n8n community node. |
| `packages/activepieces-tokencalculator/` | Activepieces community piece. |
| `public/` | Static assets copied directly into the generated site. |

## Development commands

Run the checks that match your change:

```bash
# Entire test suite
npm test

# Astro and TypeScript validation
npm run check

# Production site build
npm run build

# Package-specific builds
npm run build:core
npm run build:n8n
npm run build:activepieces

# Inspect the files that would be published to npm
npm run pack:core
npm run pack:n8n
npm run pack:activepieces

# Activepieces tests
npm run test:activepieces
```

For n8n changes, also run:

```bash
npm run lint --workspace @jay0073/n8n-nodes-tokencalculator
npx vitest run tests/n8n-extract-input.test.ts tests/n8n-node-runtime.test.ts tests/n8n-multifile.test.ts
```

## Making a change

1. Create a focused branch from `master`.
2. Make the smallest coherent change that solves the issue.
3. Add or update tests for behavior changes and regressions.
4. Update user-facing documentation when inputs, outputs, supported formats, limits, or workflows change.
5. Add an entry under `Unreleased` in [`CHANGELOG.md`](./CHANGELOG.md) for a notable user-facing change.
6. Run the relevant tests and `npm run build` before opening a pull request.

### Calculation changes

When changing token or cost calculations:

- State whether a result is exact tokenization, a provider-published formula, or a deterministic projection.
- Add fixtures for boundaries, empty inputs, Unicode text, and multiple files where relevant.
- Do not present an estimate as an exact provider bill.
- Preserve browser-local processing unless the change explicitly documents and justifies a network boundary.

### Documentation changes

- Use one clear `h1` and a logical heading hierarchy.
- Write descriptive titles and introductions for humans and search engines; avoid keyword repetition.
- Link to related internal documentation where it helps the reader continue a workflow.
- Give diagrams accessible labels and explain their meaning in nearby text.
- Reuse existing components and visual patterns instead of introducing a page-specific version of a common section.
- Verify narrow-screen layouts as well as desktop layouts.

### Integration changes

The core package is the shared source of calculation behavior. Avoid copying calculation logic into the n8n or Activepieces packages when it can be exposed through the core API.

For file inputs, test single and multiple files, absent binary data, unsupported formats, and mixed text/image batches. Integration errors should identify the failing input without exposing its content.

## Pull requests

A pull request should include:

- A concise explanation of the problem and solution.
- The areas and packages affected.
- Tests run and their results.
- Screenshots or a short recording for visible interface changes.
- Documentation and changelog updates when applicable.
- A linked issue, if one exists.

Keep unrelated formatting or refactoring out of the same pull request. Reviewers should be able to verify the change without reconstructing its intent from the diff.

## Releases and publishing

Do not publish packages from a contribution branch or include an unrequested version bump.

Maintainers publish the n8n package through the manual **Publish n8n TokenCalculator node** GitHub Actions workflow. It installs from the lockfile, builds the core package, runs focused tests and linting, publishes with npm provenance, and verifies the release with the n8n community-package scanner.

Production deployment runs through the **Deploy TokenCalculator to Cloudflare** workflow after changes reach `master`. Package versions are independent and should be bumped only for the package being released.

## Reporting security issues

Do not disclose a vulnerability in a public issue. Contact the maintainer privately through the contact details on [TokenCalculator.dev](https://tokencalculator.dev/contact) and include the affected component, reproduction steps, impact, and any suggested mitigation.

By contributing, you agree that your contribution is licensed under the repository's [MIT License](./LICENSE).
