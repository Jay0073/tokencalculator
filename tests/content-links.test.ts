import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { COMPARISONS } from '../src/data/comparisons';
import { IMAGE_MODELS, IMAGE_PAGES } from '../src/data/image-models';
import { blogPosts, docsPages } from '../src/data/knowledge';

/**
 * llms.txt is hand-written, and it had drifted: it still listed three comparison pages
 * that no longer exist. AI crawlers read it directly, so every published page must be in
 * it and every retired page must be gone.
 */
const llms = readFileSync(new URL('../public/llms.txt', import.meta.url), 'utf8');
const SITE = 'https://tokencalculator.dev';

describe('llms.txt coverage', () => {
  it('links the hub, every comparison, image page, blog post and doc', () => {
    const paths = [
      '/compare/',
      ...COMPARISONS.map((page) => `/${page.slug}/`),
      ...IMAGE_PAGES.map((page) => page.href),
      ...blogPosts.map((post) => post.href),
      ...docsPages.map((doc) => doc.href),
    ];
    for (const path of paths) expect(llms, `llms.txt is missing ${path}`).toContain(`${SITE}${path}`);
  });

  it('no longer links retired comparison pages', () => {
    for (const slug of ['gpt-5-6-sol-vs-claude-opus-4-8-cost', 'deepseek-v4-flash-vs-gpt-5-6-luna-pricing', 'gemini-3-1-flash-lite-vs-gpt-5-6-luna-cost']) {
      expect(llms, `llms.txt still links retired /${slug}/`).not.toContain(`/${slug}/`);
    }
  });
});

describe('image price data', () => {
  it('names a source and a check date for every model', () => {
    for (const model of IMAGE_MODELS) {
      expect(model.sources.length, model.id).toBeGreaterThan(0);
      expect(model.checked, model.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      for (const price of [...model.standard, model.best, ...model.prices]) expect(price.usd, model.id).toBeGreaterThan(0);
    }
  });
});
