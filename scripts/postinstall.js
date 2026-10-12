/*
// original lines
cpy --flat ./node_modules/framework7-icons/fonts/*.* ./src/fonts/ &&
cpy --flat ./node_modules/material-icons/iconfont/*.* ./src/fonts/",
 */

import fs from 'fs'; import path from 'path';

['./node_modules/framework7-icons/fonts', './node_modules/material-icons/iconfont']
    .forEach(d => {
        if (fs.existsSync(d)) {
            fs.mkdirSync('./src/fonts', { recursive: true });
            fs.readdirSync(d).forEach(f => {
                const s = path.join(d, f);
                if (fs.statSync(s).isFile()) fs.copyFileSync(s, path.join('./src/fonts', f));
            });
        }
    });
