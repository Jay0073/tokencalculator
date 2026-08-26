/**
 * Directory badges displayed in the global footer.
 *
 * Add one object after another as listings are approved. The fields deliberately
 * mirror the <a href="..."> and <img src="..." alt="..."> snippets supplied by
 * directories. `src` can be a remote PNG/WebP/SVG URL or a file under /public.
 * Width and height are optional; shared component styles normalize the display.
 * The footer stays hidden while this array is empty.
 *
 * @typedef {Object} DirectoryBadge
 * @property {string} name - Directory name used for the link title.
 * @property {string} href - TokenCalculator listing URL or verification URL.
 * @property {string} src - Directory-provided badge image URL.
 * @property {string} alt - Accessible badge label.
 * @property {number} [width] - Intrinsic width supplied by the directory.
 * @property {number} [height] - Intrinsic height supplied by the directory.
 * @property {string} [listingUrl] - Legacy alias for href.
 * @property {string} [badgeSrc] - Legacy alias for src.
 * @property {string} [badgeAlt] - Legacy alias for alt.
 */

/** @type {DirectoryBadge[]} */
export const DIRECTORY_BADGES = [
  // Paste one badge after another using the values from its HTML snippet:
  // {
  //   name: 'Submit AI Tools',
  //   href: 'https://submitaitools.org',
  //   src: 'https://submitaitools.org/static_submitaitools/images/submitaitools.png',
  //   alt: 'Submit AI Tools',
  //   width: 200, // optional
  //   height: 60, // optional
  // },
];
