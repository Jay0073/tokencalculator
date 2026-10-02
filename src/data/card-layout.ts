/**
 * Column spans for the knowledge card grid.
 *
 * The grid is 12 columns wide. The previous rules were fixed nth-child spans, which only
 * tiled when the card count happened to match: the blog grid repeated 6+6 then 4+4, so
 * every second row left a four-column hole, and the docs grid was written for exactly
 * seven cards and started leaving holes at the eighth.
 *
 * These row templates each sum to 12 and are used in turn, so a row is always full
 * whatever the card count. A short final row is widened to fill the width.
 */
const ROW_TEMPLATES: readonly (readonly number[])[] = [[7, 5], [4, 8], [5, 4, 3]];

/** How tall a card stands, by how wide it is. Wider cards carry more text. */
const MIN_HEIGHT: Readonly<Record<number, string>> = {
  12: '18rem', 8: '24rem', 7: '23rem', 6: '22rem', 5: '21rem', 4: '19rem', 3: '18rem',
};

/** Spans for a final row that has fewer cards than its template, summing to 12. */
const finalRow = (count: number): number[] => (count === 1 ? [12] : count === 2 ? [7, 5] : [5, 4, 3].slice(0, count));

export function bentoSpans(count: number): number[] {
  const rows: number[][] = [];
  let placed = 0;
  for (let index = 0; placed < count; index += 1) {
    const template = ROW_TEMPLATES[index % ROW_TEMPLATES.length];
    const remaining = count - placed;
    const row = remaining >= template.length ? [...template] : finalRow(remaining);
    rows.push(row);
    placed += row.length;
  }
  // One card alone on the last row has to stretch the full width, which leaves its text
  // stranded at the left. Fold it into the row above instead.
  const last = rows.at(-1);
  if (rows.length > 1 && last?.length === 1) {
    const above = rows.at(-2)!.length;
    if (above === 2) rows.splice(-2, 2, [5, 4, 3]);
    else if (above === 3) rows.splice(-2, 2, [7, 5], [7, 5]);
  }
  return rows.flat();
}

export const cardMinHeight = (span: number): string => MIN_HEIGHT[span] ?? '20rem';
