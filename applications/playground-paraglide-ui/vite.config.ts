import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { devtools } from '@tanstack/devtools-vite';
import tanStackRouterPluginVite from '@tanstack/router-plugin/vite';
import viteJSPluginReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';
import viteTSConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  run: {
    tasks: {
      build: {
        command: 'tsc && vp build',
      },
      check: {
        command: 'vp check',
      },
      dev: {
        command: 'vp dev',
      },
      preview: {
        command: 'vp preview',
      },
    },
  },
  // resolve: {
  //   tsconfigPaths: true,
  // },
  base: '/playground-paraglide-ui',
  plugins: [
    devtools(),
    // Eventually won't need this anymore. Doesn't work in dev though. Eventually should use `outputOptions.preserveModules`
    // https://github.com/vitejs/vite/issues/22047
    viteTSConfigPaths({ projects: ['./tsconfig.json'] }),
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
});
