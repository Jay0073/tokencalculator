const { copyFileSync, mkdirSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '..');
mkdirSync(join(root, 'dist'), { recursive: true });
copyFileSync(join(root, 'package.json'), join(root, 'dist', 'package.json'));
