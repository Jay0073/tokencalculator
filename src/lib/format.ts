/**
 * Money formatting, in one place.
 *
 * The site had eleven slightly different formatters, so the same price appeared as
 * "$0.3" in the main table, "$0.30" on a comparison page and "$0.3000" in a lab. Rates
 * and computed costs need different precision, so there are two functions and no more.
 */

/**
 * A published per-million token rate. Always at least two decimals, so $0.3 reads as
 * $0.30, and up to six, because one published rate is $0.234375 and rounding a rate the
 * provider printed would be its own kind of wrong.
 */
export const rate = (value: number | undefined): string =>
  value === undefined ? '—' : `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;

/** A computed cost, which can be far below a cent. */
export const cost = (value: number): string => {
  if (value === 0) return '$0.00';
  if (value < 0.000001) return '<$0.000001';
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: value < 1 ? 6 : 2 })}`;
};

/** A token or context figure: grouped digits, never decimals. */
export const count = (value: number): string => Math.round(value).toLocaleString('en-US');
