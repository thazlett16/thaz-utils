import viteJSPluginReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';

import { devtools } from '@tanstack/devtools-vite';
import tanStackRouterPluginVite from '@tanstack/router-plugin/vite';

import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { playwright } from 'vite-plus/test/browser-playwright';

// const VIEW_PORT_OPTIONS = {
//   LARGE: { width: 2560, height: 1440 },
//   DESKTOP: { width: 1920, height: 1080 },
//   IPAD_MINI: { width: 768, height: 1024 },
//   IPHONE_MINI: { width: 375, height: 667 },
// };

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
              // { name: 'browser-chromium-desktop', browser: 'chromium', viewport: VIEW_PORT_OPTIONS.DESKTOP },
              // { name: 'browser-firefox-desktop', browser: 'firefox', viewport: VIEW_PORT_OPTIONS.DESKTOP },
              // { name: 'browser-chromium-ipad', browser: 'chromium', viewport: VIEW_PORT_OPTIONS.IPAD_MINI },
              // { name: 'browser-firefox-ipad', browser: 'firefox', viewport: VIEW_PORT_OPTIONS.IPAD_MINI },
              // { name: 'browser-chromium-iphone', browser: 'chromium', viewport: VIEW_PORT_OPTIONS.IPHONE_MINI },
              // { name: 'browser-firefox-iphone', browser: 'firefox', viewport: VIEW_PORT_OPTIONS.IPHONE_MINI },
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
