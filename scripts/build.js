/*
// original lines
npx workbox generateSW workbox-config.cjs &&
npx cpy assets-src/SINPEFACIL_OGTAGS_LOGO.png www/icons/og.png &&
npx cpy assets-src/SINPEFACIL_BADGE.png www/icons/badge.png &&
npx cpy src/js/sw-extra.js www/sw-extra.js",
*/

import fs from 'fs';
fs.mkdirSync('www/icons', { recursive: true });
fs.copyFileSync('assets-src/SINPEFACIL_OGTAGS_LOGO.png', 'www/icons/og.png');
fs.copyFileSync('assets-src/SINPEFACIL_BADGE.png', 'www/icons/badge.png');
fs.copyFileSync('src/js/sw-extra.js', 'www/sw-extra.js');
