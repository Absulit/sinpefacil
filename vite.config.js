import { fileURLToPath, URL } from 'node:url';
import framework7 from 'rollup-plugin-framework7';

const SRC_DIR = fileURLToPath(new URL('./src', import.meta.url));
const PUBLIC_DIR = fileURLToPath(new URL('./public', import.meta.url));
const BUILD_DIR = fileURLToPath(new URL('./www', import.meta.url));

export default async () => {

  return {
    plugins: [
      framework7({ emitCss: false }),

    ],
    root: SRC_DIR,
    base: '',
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
      },
    },
    server: {
      host: true,
    },
    esbuild: {
      jsxFactory: '$jsx',
      jsxFragment: '"Fragment"',
    },
  };
}
