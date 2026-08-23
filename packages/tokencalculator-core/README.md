# @jay0073/tokencalculator-core

Dependency-free token cost, workload, and context-window math for Node.js and browser projects.

Web GUI: [https://tokencalculator.dev](https://tokencalculator.dev)

The web GUI also counts combined workloads from pasted text, readable PDF and DOCX documents, source/data files, and supported images. Document extraction and image-dimension processing stay in the browser.

```bash
npm install @jay0073/tokencalculator-core
```

```ts
import { calculateTokenCost, projectWorkload } from '@jay0073/tokencalculator-core';

const cost = calculateTokenCost(
  { inputTokens: 500_000, outputTokens: 2_000, cachedInputTokens: 100_000 },
  { inputPerMillion: 2, outputPerMillion: 12, cachedInputPerMillion: 0.2 },
);
const workload = projectWorkload(cost.total, 1_000);
```

This package accepts pricing as input instead of freezing fast-changing rates into application code. The [TokenCalculator.dev web GUI](https://tokencalculator.dev) maintains the model catalog and shows each rate's source and verification date.

All calculations are local. No prompt, token count, or file content is transmitted.
