import { describe, expect, it } from 'vitest';
import { bentoSpans, cardMinHeight } from '../src/data/card-layout';
import { blogPosts, docsPages } from '../src/data/knowledge';

/** Walk the spans and return the width of each row. */
const rows = (spans: number[]) => {
  const widths: number[] = [];
  let current = 0;
  for (const span of spans) {
    current += span;
    if (current >= 12) { widths.push(current); current = 0; }
  }
  if (current > 0) widths.push(current);
  return widths;
};

describe('knowledge card layout', () => {
  it('fills every row, for every card count', () => {
    // The old rules left a four-column hole on every second blog row, and on the docs
    // page from the eighth card onwards.
    for (let count = 1; count <= 40; count += 1) {
      const spans = bentoSpans(count);
      expect(spans, `count ${count}`).toHaveLength(count);
      for (const width of rows(spans)) expect(width, `count ${count} row width`).toBe(12);
    }
  });

  it('never strands a single card alone on the last row', () => {
    for (let count = 2; count <= 40; count += 1) {
      const spans = bentoSpans(count);
      expect(spans.at(-1), `count ${count}`).not.toBe(12);
    }
  });

  it('keeps every card within the grid', () => {
    for (const span of bentoSpans(25)) {
      expect(span).toBeGreaterThanOrEqual(3);
      expect(span).toBeLessThanOrEqual(12);
      expect(cardMinHeight(span)).toMatch(/rem$/);
    }
  });

  it('covers the live blog and docs indexes', () => {
    for (const entries of [blogPosts, docsPages]) {
      expect(rows(bentoSpans(entries.length)).every((width) => width === 12)).toBe(true);
    }
  });
});
