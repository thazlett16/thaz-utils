import { defineConfig } from 'vite-plus';

export default defineConfig({
  run: {
    tasks: {
      build: {
        command: 'vp pack',
        dependsOn: ['@thaz-util/oxfmt-config#build', '@thaz-util/oxlint-config#build'],
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
