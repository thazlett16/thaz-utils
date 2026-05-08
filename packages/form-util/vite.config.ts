import vitePluginReact from '@vitejs/plugin-react';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import { defineConfig } from 'vite-plus';

import { playwright } from 'vite-plus/test/browser-playwright';

export default defineConfig({
  run: {
    tasks: {
      build: {
        command: 'vp pack',
        dependsOn: ['@thazstack/temporal-util#build', '@thazstack/temporal-valibot-util#build'],
      },
      test: {
        command: 'vp test',
        dependsOn: ['@thazstack/form-util#build'],
      },
      check: {
        command: 'vp check',
        dependsOn: ['@thazstack/form-util#build'],
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    externalizeDeps(),
    // Eventually won't need this anymore. Doesn't work in dev though. Eventually should use `outputOptions.preserveModules`
    // https://github.com/vitejs/vite/issues/22047
    // This might be working now? But leaving till I know for sure
    // import viteTSConfigPaths from 'vite-tsconfig-paths';
    // viteTSConfigPaths(),
    vitePluginReact(),
  ],
  pack: {
    dts: {
      build: true,
    },
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
  test: {
    coverage: {
      enabled: true,
      include: ['src/**/*.{ts,tsx}'],
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
