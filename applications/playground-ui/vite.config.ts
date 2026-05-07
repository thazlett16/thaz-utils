import viteJSPluginReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';

import { devtools } from '@tanstack/devtools-vite';
import tanStackRouterPluginVite from '@tanstack/router-plugin/vite';

import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { playwright } from 'vite-plus/test/browser-playwright';

export default defineConfig({
  run: {
    tasks: {
      dev: {
        command: 'vp dev',
      },
      build: {
        command: 'vp build',
        dependsOn: [
          '@thazstack/temporal-util#build',
          '@thazstack/temporal-valibot-util#build',
          '@thazstack/network-util#build',
          '@thazstack/form-util#build',
          '@thazstack/form-dayjs-util#build',
          '@thazstack/form-internationalized-date-util#build',
        ],
      },
      preview: {
        command: 'vp preview',
      },
      test: {
        command: 'vp test',
        // dependsOn: ['playground-ui#build'],
      },
      check: {
        command: 'vp check',
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
  base: '/playground-ui',
  plugins: [
    devtools(),
    // Eventually won't need this anymore. Doesn't work in dev though. Eventually should use `outputOptions.preserveModules`
    // https://github.com/vitejs/vite/issues/22047
    // This might be working now? But leaving till I know for sure
    // import viteTSConfigPaths from 'vite-tsconfig-paths';
    // viteTSConfigPaths(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/paraglide',
      emitTsDeclarations: true,
      emitPrettierIgnore: false,
      strategy: ['cookie', 'preferredLanguage', 'localStorage', 'baseLocale'],
    }),
    tanStackRouterPluginVite({
      target: 'react',
      autoCodeSplitting: true,
      generatedRouteTree: './src/route-tree.gen.ts',
      routesDirectory: './src/routes',
    }),
    viteJSPluginReact(),
  ],
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  test: {
    // include: ['test/**/*.node.test.ts'],
    // typecheck: {
    //   enabled: true,
    //   include: ['test/**/*.test-d.ts'],
    // },
    // coverage: {
    //   include: ['src/**/*.{ts,tsx}'],
    //   enabled: true,
    //   provider: 'v8',
    // },
    projects: [
      {
        extends: true,
        test: {
          name: 'node',
          include: ['test/**/*.node.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'browser',
          include: ['test/**/*.browser.test.{ts,tsx}'],
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }, { browser: 'firefox' }],
          },
        },
      },
      {
        extends: true,
        test: {
          name: 'types',
          include: ['test/**/*.test-d.{ts,tsx}'],
          typecheck: {
            enabled: true,
          },
        },
      },
    ],
  },
});
