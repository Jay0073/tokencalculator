# @jay0073/tokencalculator-core

The shared TypeScript calculation engine behind a privacy-first, browser-based token calculator. It provides local token measurement, model cost comparison, image-token formulas, context-window analysis, and workload forecasting for Node.js and browser projects.

Web GUI: [https://tokencalculator.dev](https://tokencalculator.dev)

The web GUI also counts combined workloads from pasted text, readable PDF and DOCX documents, source/data files, and supported images. Document extraction and image-dimension processing stay in the browser.

```bash
npm install @jay0073/tokencalculator-core
```

```ts
import { compareModels, measureModel, projectWorkload } from '@jay0073/tokencalculator-core';

const measurement = await measureModel(
  { text: 'A prompt or extracted document body', outputTokens: 2_000 },
  'gpt-5.6-terra',
);

const comparison = await compareModels(
  { text: 'The same workload', outputTokens: 2_000 },
  ['gpt-5.6-terra', 'claude-sonnet-5', 'gemini-3.1-flash-lite'],
);

const multiFileComparison = await compareModels(
  {
    files: [
      { text: 'Text extracted from the first uploaded file' },
      { text: 'Text extracted from the second uploaded file' },
      { image: { width: 1600, height: 900, detail: 'high' } },
    ],
    outputTokens: 2_000,
  },
  ['gpt-5.6-terra', 'claude-sonnet-5'],
);

const monthly = projectWorkload(measurement.cost.total, 1_000);
```

OpenAI-compatible text uses exact local `o200k_base` BPE tokenization through `js-tiktoken`. Other tokenizer families use deterministic Provider-Calibrated UTF-8 Token Projections, and images use provider-family formulas. Low-level helpers such as `calculateTokenCost`, `calculateContextUsage`, and `resolveModelRates` are also exported.

The bundled catalog supplies convenient model defaults. Pricing and model limits change frequently, so production callers can override rates and should treat provider invoices as authoritative.

The core accepts any number of already-extracted text files and image dimensions through `files`; browser or workflow adapters remain responsible for reading the original file bytes. The older singular `image` input remains supported, and `images` is available when file metadata is unnecessary.

All calculations are local. No prompt, token count, or file content is transmitted.
