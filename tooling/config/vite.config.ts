import { defineConfig } from 'vite-plus';

export default defineConfig({
  run: {
    tasks: {
      build: {
        command: 'vp pack',
      },
    },
  },
  pack: {
    dts: true,
    entry: {
      oxfmt: './src/oxfmt/index.ts',
      oxlint: './src/oxlint/index.ts',
    },
    exports: {
      customExports: {
        './bundler-dom': './typescript-configs/bundler-dom.json',
        './bundler-dom-react': './typescript-configs/bundler-dom-react.json',
        './bundler-no-dom': './typescript-configs/bundler-no-dom.json',
        './oxfmt': {
          types: './dist/oxfmt.d.mts',
          import: './dist/oxfmt.mjs',
        },
        './oxlint': {
          types: './dist/oxlint.d.mts',
          import: './dist/oxlint.mjs',
        },
      },
    },
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
});
