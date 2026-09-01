# @jay0073/piece-tokencalculator

Token Calculator for Activepieces counts LLM tokens and compares estimated costs for mapped text, multiple UTF-8 text/source files, and multiple PNG, JPEG, GIF, or WebP images.

## Actions

- **Count Tokens** — measure input for one model.
- **Estimate Cost** — include cached input and expected output tokens in a USD estimate.
- **Compare Models** — return side-by-side measurements and identify the cheapest selected model.

No credentials are required. Content is processed inside the Activepieces execution runtime and is not sent to TokenCalculator.dev.

## Install from npm

After this package is published publicly, open **Settings → My Pieces → Install Piece** in Activepieces and enter:

```text
@jay0073/piece-tokencalculator
```

## Development

```bash
npm run test:activepieces
npm run build:activepieces
npm run pack:activepieces
```

The package is intentionally self-contained so its CommonJS runtime matches the current Activepieces piece format.
