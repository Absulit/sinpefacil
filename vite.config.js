import { fileURLToPath, URL } from 'node:url';
import framework7 from 'rollup-plugin-framework7';
import basicSsl from '@vitejs/plugin-basic-ssl';

const SRC_DIR = fileURLToPath(new URL('./src', import.meta.url));
const PUBLIC_DIR = fileURLToPath(new URL('./public', import.meta.url));
const BUILD_DIR = fileURLToPath(new URL('./www', import.meta.url));

export default async () => {

  return {
    plugins: [
      framework7({ emitCss: false }),
      basicSsl(),

    ],
    root: SRC_DIR,
    base: '/',
    publicDir: PUBLIC_DIR,
    build: {
      outDir: BUILD_DIR,
      assetsInlineLimit: 0,
      emptyOutDir: true,
      rollupOptions: {
        treeshake: false,
      },
    },
    resolve: {
      alias: {
        '@': SRC_DIR,
        '@js': SRC_DIR + '/js/',
        'db': SRC_DIR + '/js/db.js',
        'share': SRC_DIR + '/js/share.js',
      },
    },
    server: {
      https: false, // false for serveo, true for ngrok
      host: true,
      allowedHosts: [
        '.serveousercontent.com',
        '.ngrok-free.app',
      ]
    },
    esbuild: {
      jsxFactory: '$jsx',
      jsxFragment: '"Fragment"',
    },
  };
}
