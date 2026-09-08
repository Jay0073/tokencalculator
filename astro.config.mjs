import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const SITE = 'https://tokencalculator.dev';
const pagesDir = fileURLToPath(new URL('./src/pages/', import.meta.url));
const gitDateCache = new Map();

/** Last commit date for a source file, as an ISO string. Undefined when unknown. */
function lastCommitDate(file) {
  if (gitDateCache.has(file)) return gitDateCache.get(file);
  let iso;
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (out) iso = new Date(out).toISOString();
  } catch {
    iso = undefined;
  }
  gitDateCache.set(file, iso);
  return iso;
}

/** Map a built URL back to the source file that produces it. */
function sourceFor(pathname) {
  const clean = pathname.replace(/^\/|\/$/g, '');
  const candidates = clean
    ? [`${clean}.astro`, `${clean}/index.astro`]
    : ['index.astro'];

  // Dynamic routes resolve to their template.
  if (/-token-counter$/.test(clean)) candidates.push('[provider]-token-counter.astro');
  else if (/^(es|ja|de|pt-BR)$/.test(clean)) candidates.push('[lang]/index.astro');
  else if (clean && !clean.includes('/')) candidates.push('[comparison].astro');

  for (const candidate of candidates) {
    const full = pagesDir + candidate;
    if (existsSync(full)) return full;
  }
  return undefined;
}

export default defineConfig({
  site: SITE,
  output: 'static',
  i18n: {
    locales: ['en', 'es', 'ja', 'de', 'pt-BR'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      // Machine-readable API contract, so agents can discover it from the sitemap.
      customPages: [`${SITE}/openapi.json`],
      serialize(item) {
        const source = sourceFor(new URL(item.url).pathname);
        const lastmod = source ? lastCommitDate(source) : undefined;
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
