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
 * @property {string} [srcset] - Optional responsive image candidates supplied by the directory.
 * @property {string} [listingUrl] - Legacy alias for href.
 * @property {string} [badgeSrc] - Legacy alias for src.
 * @property {string} [badgeAlt] - Legacy alias for alt.
 */

/** @type {DirectoryBadge[]} */
export const DIRECTORY_BADGES = [
  {
    name: 'Submit AI Tools',
    href: 'https://submitaitools.org',
    src: 'https://submitaitools.org/static_submitaitools/images/submitaitools.png',
    alt: 'Submit AI Tools',
    width: 200,
    height: 60,
  },
  {
    name: 'ToolPilot',
    href: 'https://www.toolpilot.ai/',
    src: 'https://www.toolpilot.ai/cdn/shop/files/f-w_690x151_crop_center.png',
    alt: 'Featured on ToolPilot',
    width: 690,
    height: 151,
  },
  {
    name: 'FrogDR',
    href: 'https://frogdr.com/tokencalculator.dev?utm_source=tokencalculator.dev',
    src: 'https://frogdr.com/tokencalculator.dev/badge-light.svg?badge=1&s=ui',
    alt: 'Monitor your Domain Rating with FrogDR',
    width: 250,
    height: 54,
  },
  {
    name: 'AI Hunt List',
    href: 'https://aihuntlist.com/tool/tokencalculator-dev',
    src: 'https://aihuntlist.com/badge-dark.svg',
    alt: 'Featured on AI Hunt List',
    width: 200,
    height: 54,
  },
  {
    name: 'Best AI',
    href: 'https://best-ai.org',
    src: 'https://best-ai.org/images/badge-best-ai-org.png',
    srcset: 'https://best-ai.org/images/badge-best-ai-org.png 1x, https://best-ai.org/images/badge-best-ai-org@2x.png 2x',
    alt: 'Listed on Best-AI.org',
    width: 200,
    height: 48,
  },
  {
    name: 'Bowora',
    href: 'https://bowora.com/?via=k4t62aaa',
    src: '/badges/bowora.svg',
    alt: 'Featured on Bowora',
    width: 170,
    height: 50,
  },
  {
    name: 'FindYourAgent',
    href: 'https://findyouragent.ai',
    src: 'https://findyouragent.ai/embed-badge-gradient.svg',
    alt: 'Featured on FindYourAgent',
    width: 200,
    height: 54,
  },
  {
    name: 'Uno Directory',
    href: 'https://uno.directory',
    src: 'https://uno.directory/uno-directory.svg',
    alt: 'Listed on Uno Directory',
    width: 120,
    height: 30,
  },
  {
    name: 'Webspot',
    href: 'https://webspot.app',
    src: 'https://webspot.app/featured-dark.svg',
    alt: 'Featured on Webspot',
    width: 200,
    height: 54,
  },
  {
    name: 'OpenHunts',
    href: 'https://openhunts.com',
    src: 'https://cdn.openhunts.com/badges/club.webp',
    alt: 'OpenHunts Club Member',
    width: 195,
    height: 42,
  },
];
