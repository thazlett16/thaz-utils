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
        dependsOn: [
          '@thazstack/temporal-util#build',
          '@thazstack/temporal-valibot-util#build',
          '@thazstack/network-util#build',
          '@thazstack/form-util#build',
          '@thazstack/form-dayjs-util#build',
          '@thazstack/form-internationalized-date-util#build',
        ],
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
        dependsOn: ['playground-ui#build'],
      },
      test: {
        command: 'vp test',
        // dependsOn: ['playground-ui#build'],
      },
      typecheck: {
        command: 'vp lint',
        dependsOn: ['playground-ui#build'],
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
    coverage: {
      enabled: true,
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/paraglide/**',
        'src/components/app-form-root.ts',
        'src/components/devtools.tsx',
        'src/configs/**',
        'src/services/**',
        'src/route-tree.gen.ts',
        'src/main.ts',
        'src/entry-app.tsx',
      ],
      provider: 'istanbul',
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
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
          include: ['test/**/*.browser.test.{ts,tsx}'],
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [
              { name: 'browser-chromium', browser: 'chromium' },
              { name: 'browser-firefox', browser: 'firefox' },
            ],
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
