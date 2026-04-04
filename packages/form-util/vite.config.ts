import vitePluginReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';
import viteTSConfigPaths from 'vite-tsconfig-paths';
// import vitePluginDTS from 'vite-plugin-dts';
// import { externalizeDeps } from 'vite-plugin-externalize-deps';
// import rollupPluginPreserveDirectives from 'rollup-plugin-preserve-directives';

export default defineConfig({
  run: {
    tasks: {
      build: {
        command: 'vp pack',
        dependsOn: ['@thazstack/temporal-util#build', '@thazstack/temporal-valibot-util#build'],
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
    // Don't think we need this one but should double-check.
    // externalizeDeps(),
    // Do I want this one/need? Not sure
    // rollupPluginPreserveDirectives(),
    // Don't think we need this one anymore? I'm getting the .d.mts files
    // vitePluginDTS(),
    vitePluginReact(),
  ],
  build: {
    rolldownOptions: {
      external: ['react']
    }
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
