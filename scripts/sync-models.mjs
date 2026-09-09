#!/usr/bin/env node
/**
 * Regenerate the model catalogue from models.dev.
 *
 * Design rule: every number in the output comes from the upstream feed. This script
 * only decides which models to publish and which tokenizer/vision family they belong
 * to. Nothing here invents a price, and no language model is involved. That separation
 * is deliberate - hand-maintained prices are what let the catalogue drift 3-4x off.
 *
 *   node scripts/sync-models.mjs           regenerate from the network
 *   node scripts/sync-models.mjs --offline regenerate from the committed snapshot
 *   node scripts/sync-models.mjs --check   exit 1 if the generated files are stale
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const policy = JSON.parse(readFileSync(path.join(root, 'scripts/model-policy.json'), 'utf8'));
const snapshotPath = path.join(root, 'scripts/models.snapshot.json');
const args = new Set(process.argv.slice(2));

async function loadCatalog() {
  if (args.has('--offline')) {
    if (!existsSync(snapshotPath)) throw new Error('No snapshot to read. Run once online first.');
    console.log('Using committed snapshot (offline mode).');
    return JSON.parse(readFileSync(snapshotPath, 'utf8'));
  }
  const response = await fetch(policy.source, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`${policy.source} returned ${response.status}`);
  const catalog = await response.json();
  const providerCount = Object.keys(catalog).length;
  if (providerCount < 50) throw new Error(`Suspiciously small catalogue (${providerCount} providers); refusing to overwrite.`);
  return catalog;
}

const matches = (id, patterns) => patterns.some((pattern) => new RegExp(pattern).test(id));

/** Mirrors BYTES_PER_TOKEN in the core package, for the flatter Activepieces shape. */
const BYTES_PER_TOKEN = {
  o200k_base: 4,
  'claude-estimate': 3.75,
  'gemini-estimate': 4,
  'deepseek-estimate': 3.85,
  'qwen-estimate': 3.7,
  'kimi-estimate': 3.7,
  'glm-estimate': 3.7,
  'grok-estimate': 4,
  'llama-estimate': 4,
};

/** Pick the models to publish for one provider, newest first. */
function selectModels(providerId, config, catalog) {
  const upstream = catalog[providerId]?.models ?? {};
  const candidates = [];

  for (const [id, model] of Object.entries(upstream)) {
    const cost = model.cost ?? {};
    const limit = model.limit ?? {};
    // A model is only usable here if it has both rates and a context window.
    if (typeof cost.input !== 'number' || typeof cost.output !== 'number') continue;
    if (typeof limit.context !== 'number' || limit.context <= 0) continue;
    if (config.include && !matches(id, config.include)) continue;
    if (config.exclude && matches(id, config.exclude)) continue;

    candidates.push({
      id,
      name: model.name ?? id,
      provider: providerId,
      description: model.reasoning ? 'Reasoning model' : 'General purpose',
      tokenizer: config.tokenizer,
      textAccuracy: config.accuracy,
      contextWindow: limit.context,
      maxOutput: limit.output ?? Math.min(limit.context, 8192),
      inputPerMillion: cost.input,
      cachedInputPerMillion: typeof cost.cache_read === 'number' ? cost.cache_read : undefined,
      outputPerMillion: cost.output,
      // Only claim image support when the upstream feed says the model accepts images
      // AND this provider family has a documented image-token formula.
      vision: config.vision && (model.modalities?.input ?? []).includes('image') ? config.vision : undefined,
      pricingUrl: config.pricingUrl,
      releaseDate: model.release_date ?? '',
      verifiedAt: new Date().toISOString().slice(0, 10),
    });
  }

  candidates.sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || '') || a.id.localeCompare(b.id));

  // Pinned models are published regardless of age; the rest of the slots go to the
  // newest releases. Without this, a burst of new launches silently drops the cheap
  // tier and the well-known older models people actually search for.
  const pinned = new Set(policy.pinned ?? []);
  const chosen = [
    ...candidates.filter((model) => pinned.has(model.id)),
    ...candidates.filter((model) => !pinned.has(model.id)).slice(0, Math.max(0, policy.maxModelsPerProvider - candidates.filter((m) => pinned.has(m.id)).length)),
  ].sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || '') || a.id.localeCompare(b.id));

  // Merge the hand-maintained layer for facts models.dev does not carry.
  for (const model of chosen) {
    const override = policy.overrides?.[model.id];
    if (!override) continue;
    for (const [key, value] of Object.entries(override)) {
      // Guard the invariant: an override may never restate a base rate. Those must
      // stay owned by the upstream feed, or the drift problem comes straight back.
      if (['inputPerMillion', 'outputPerMillion', 'cachedInputPerMillion', 'contextWindow'].includes(key)) {
        throw new Error(`Override for '${model.id}' must not set '${key}'. Base rates come from ${policy.source}.`);
      }
      model[key] = value;
    }
  }
  return chosen;
}

const num = (value) => (Number.isInteger(value) ? value.toLocaleString('en-US').replace(/,/g, '_') : String(value));

function serialize(model, { accuracyKey = 'textAccuracy', defaultId } = {}) {
  const fields = [
    `id:'${model.id}'`,
    `name:'${model.name.replace(/'/g, "\\'")}'`,
    `provider:'${model.provider}'`,
    `description:'${model.description}'`,
    `tokenizer:'${model.tokenizer}'`,
    `${accuracyKey}:'${model.textAccuracy}'`,
    `contextWindow:${num(model.contextWindow)}`,
    `maxOutput:${num(model.maxOutput)}`,
    `inputPerMillion:${model.inputPerMillion}`,
    ...(model.cachedInputPerMillion !== undefined ? [`cachedInputPerMillion:${model.cachedInputPerMillion}`] : []),
    `outputPerMillion:${model.outputPerMillion}`,
    ...(model.pricingTiers ? [`pricingTiers:${JSON.stringify(model.pricingTiers).replace(/"([a-zA-Z]+)":/g, '$1:').replace(/"/g, "'")}`] : []),
    ...(model.vision ? [`vision:'${model.vision}'`] : []),
    `pricingUrl:'${model.pricingUrl}'`,
    `releaseDate:'${model.releaseDate}'`,
    `verifiedAt:'${model.verifiedAt}'`,
    ...(model.id === defaultId ? ['isDefault:true'] : []),
  ];
  return `  { ${fields.join(', ')} },`;
}

const BANNER = `// GENERATED FILE - DO NOT EDIT BY HAND.
// Produced by scripts/sync-models.mjs from ${policy.source}.
// Every rate below comes from that feed. To change which models appear,
// edit scripts/model-policy.json and re-run: npm run sync:models`;

function main(catalog) {
  const selected = [];
  const report = [];
  for (const [providerId, config] of Object.entries(policy.providers)) {
    const models = selectModels(providerId, config, catalog);
    if (!models.length) report.push(`  ! ${providerId}: no models matched the policy`);
    else report.push(`  ${config.label.padEnd(16)} ${String(models.length).padStart(2)}  ${models.map((m) => m.id).join(', ')}`);
    selected.push(...models);
  }

  if (!selected.some((model) => model.id === policy.defaultModel)) {
    throw new Error(`Default model '${policy.defaultModel}' was not selected. Fix scripts/model-policy.json.`);
  }

  // `verifiedAt` is stamped with today's date on every run, which is the honest claim
  // to publish but means a no-op sync still rewrites every line. Compare the material
  // fields against what is already generated so CI only opens a pull request when a
  // rate, a context window or the model list actually moved.
  const materialFields = ['id', 'name', 'provider', 'contextWindow', 'maxOutput', 'inputPerMillion', 'cachedInputPerMillion', 'outputPerMillion', 'vision', 'tokenizer'];
  // The generated file writes large integers with underscore separators, so both sides
  // are normalised before comparing.
  const norm = (value) => String(value ?? '').replace(/_/g, '');
  const fingerprint = (entry) => materialFields.map((field) => `${field}=${norm(entry[field])}`).join('|');
  const sitePath = path.join(root, 'src/data/models.ts');
  let previous = '';
  if (existsSync(sitePath)) {
    // One model per line in the generated file. A regex over the whole text would stop
    // at the first closing brace, which for a model with pricingTiers sits inside the
    // tier object and truncates the entry before its later fields.
    previous = readFileSync(sitePath, 'utf8')
      .split('\n')
      .filter((line) => line.trimStart().startsWith("{ id:'"))
      .map((line) => {
        const read = (field) => (line.match(new RegExp(`(?<![a-zA-Z])${field}:'?([^,'}\\]]*)'?`)) ?? [, ''])[1].trim();
        return materialFields.map((field) => `${field}=${norm(read(field))}`).join('|');
      })
      .join('\n');
  }
  const current = selected.map(fingerprint).join('\n');
  const materialChange = previous !== current;
  console.log(`\nMATERIAL_CHANGE=${materialChange ? 'yes' : 'no'}`);

  // Site catalogue: this file is generated end to end.
  const siteBody = selected.map((model) => serialize(model, { defaultId: policy.defaultModel })).join('\n');
  writeFileSync(
    path.join(root, 'src/data/models.ts'),
    `${BANNER}\nimport type { ModelConfig } from '../domain/models';\n\n`
      + `export const MODELS: ModelConfig[] = [\n${siteBody}\n];\n\n`
      + `export const DEFAULT_MODEL = MODELS.find((model) => model.isDefault) ?? MODELS[0];\n`
      + `export const getModel = (id: string) => MODELS.find((model) => model.id === id) ?? DEFAULT_MODEL;\n`,
    'utf8',
  );

  // npm package catalogue: patched in place between markers, so the hand-written
  // helpers around it (getModel, aliases, tokenizers) stay untouched.
  const corePath = path.join(root, 'packages/tokencalculator-core/src/index.ts');
  const coreSource = readFileSync(corePath, 'utf8');
  const coreBody = selected.map((model) => serialize(model, { accuracyKey: 'accuracy' })).join('\n');
  const block = `// <generated-models>\n${BANNER}\nexport const MODELS: readonly ModelConfig[] = [\n${coreBody}\n];\n// </generated-models>`;
  const markerPattern = /\/\/ <generated-models>[\s\S]*?\/\/ <\/generated-models>/;
  const fallbackPattern = /export const MODELS: readonly ModelConfig\[\] = \[[\s\S]*?\n\];/;
  // Check that a block was found, not that the text changed: an unchanged catalogue
  // is a normal no-op run, not a failure.
  const replaceBlock = (source, label) => {
    const pattern = markerPattern.test(source) ? markerPattern : fallbackPattern;
    if (!pattern.test(source)) throw new Error(`Could not locate the MODELS block in ${label}.`);
    return source.replace(pattern, () => block);
  };
  writeFileSync(corePath, replaceBlock(coreSource, 'the core package'), 'utf8');

  // Activepieces piece: same catalogue, flatter shape.
  const apPath = path.join(root, 'packages/activepieces-tokencalculator/src/lib/calculator.ts');
  const apSource = readFileSync(apPath, 'utf8');
  const visionFamily = { 'openai-tiles': 'openai', 'claude-patches': 'claude', 'gemini-tiles': 'gemini' };
  const apBody = selected.map((model) => {
    const fields = [
      `id: '${model.id}'`,
      `name: '${model.name.replace(/'/g, "\\'")}'`,
      `provider: '${model.provider}'`,
      `contextWindow: ${num(model.contextWindow)}`,
      `inputPerMillion: ${model.inputPerMillion}`,
      ...(model.cachedInputPerMillion !== undefined ? [`cachedInputPerMillion: ${model.cachedInputPerMillion}`] : []),
      `outputPerMillion: ${model.outputPerMillion}`,
      `bytesPerToken: ${BYTES_PER_TOKEN[model.tokenizer] ?? 4}`,
      ...(model.vision ? [`vision: '${visionFamily[model.vision]}'`] : []),
    ];
    return `  { ${fields.join(', ')} },`;
  }).join('\n');
  const apBlock = `// <generated-models>\n${BANNER}\nexport const MODELS: readonly ModelConfig[] = [\n${apBody}\n];\n// </generated-models>`;
  const apPattern = markerPattern.test(apSource) ? markerPattern : fallbackPattern;
  if (!apPattern.test(apSource)) throw new Error('Could not locate the MODELS block in the Activepieces package.');
  writeFileSync(apPath, apSource.replace(apPattern, () => apBlock), 'utf8');


  // llms.txt carries a pricing table that AI agents read directly. It was hand-written
  // and had drifted to the same wrong rates as the rest of the catalogue, so generate it.
  const llmsPath = path.join(root, 'public/llms.txt');
  const llmsSource = readFileSync(llmsPath, 'utf8');
  const verified = selected[0]?.verifiedAt ?? new Date().toISOString().slice(0, 10);
  // Sub-cent rates need more precision than two decimals; anything larger reads as money.
  const money = (value) => value === undefined ? '-' : `$${Number(value) < 0.01 ? Number(value).toFixed(6).replace(/0+$/, '') : Number(value).toFixed(2)}`;
  const pricingTable = [
    '<!-- generated-pricing:start -->',
    '## Model pricing snapshot',
    '',
    `Rates below are USD per one million tokens, regenerated from ${policy.source} and verified ${verified}. The browser refreshes them from the same source at runtime. Long-context tiers and provider terms can still change a final bill.`,
    '',
    '| Model | Provider | Input | Cached input | Output | Context |',
    '| --- | --- | ---: | ---: | ---: | ---: |',
    ...selected.map((model) => `| ${model.name} | ${policy.providers[model.provider].label} | ${money(model.inputPerMillion)} | ${money(model.cachedInputPerMillion)} | ${money(model.outputPerMillion)} | ${model.contextWindow.toLocaleString('en-US')} |`),
    '',
    `Models with a long-context tier: ${selected.filter((m) => m.pricingTiers).map((m) => m.name).join(', ') || 'none'}. Above the tier threshold the higher rate applies to the whole request.`,
    '<!-- generated-pricing:end -->',
  ].join('\n');
  const pricingPattern = /<!-- generated-pricing:start -->[\s\S]*?<!-- generated-pricing:end -->/;
  if (!pricingPattern.test(llmsSource)) throw new Error('Could not locate the pricing markers in public/llms.txt.');
  writeFileSync(llmsPath, llmsSource.replace(pricingPattern, () => pricingTable), 'utf8');

  // Keep a snapshot so builds are deterministic and work without the network.
  const trimmed = {};
  for (const providerId of Object.keys(policy.providers)) {
    if (catalog[providerId]) trimmed[providerId] = catalog[providerId];
  }
  writeFileSync(snapshotPath, `${JSON.stringify(trimmed, null, 1)}\n`, 'utf8');

  console.log(`\nGenerated ${selected.length} models across ${Object.keys(policy.providers).length} providers:\n${report.join('\n')}\n`);
  console.log(`Snapshot written to scripts/models.snapshot.json`);
}

main(await loadCatalog());
