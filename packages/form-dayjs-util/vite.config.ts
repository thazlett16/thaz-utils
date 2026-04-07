import vitePluginReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';
import viteTSConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  run: {
    tasks: {
      build: {
        command: 'vp pack',
        dependsOn: [
          '@thazstack/temporal-util#build',
          '@thazstack/temporal-valibot-util#build',
          '@thazstack/form-util#build',
        ],
      },
    },
  },
  // resolve: {
  //   tsconfigPaths: true,
  // },
  plugins: [
    // Eventually won't need this anymore. Doesn't work in dev though. Eventually should use `outputOptions.preserveModules`
    // https://github.com/vitejs/vite/issues/22047
    viteTSConfigPaths(),
    vitePluginReact(),
  ],
  build: {
    rolldownOptions: {
      external: [
        '@thazstack/form-util',
        '@js-temporal/polyfill',
        '@tanstack/react-form',
        '@thazstack/temporal-util',
        '@thazstack/temporal-valibot-util',
        'dayjs',
        'react',
        'valibot',
      ],
    },
  },
  pack: {
    dts: true,
    outputOptions: {
      preserveModules: true,
    },
    entry: {
      index: './src/index.ts',
    },
    exports: {
      customExports: {
        '.': {
          types: './dist/index.d.mts',
          import: './dist/index.mjs',
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
