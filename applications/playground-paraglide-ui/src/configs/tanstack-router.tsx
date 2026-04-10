import { createRouter as tanStackCreateRouter, ErrorComponent } from '@tanstack/react-router';

import { routeTree } from '#src/route-tree.gen';

export function createRouter() {
  return tanStackCreateRouter({
    routeTree,
    basepath: '/playground-paraglide-ui',
    routeMasks: [],
    search: {
      strict: true,
    },
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultPendingMs: 700,
    defaultPendingMinMs: 500,
    defaultPendingComponent: () => {
      return <>Loading...</>;
    },
    defaultErrorComponent: ({ error }) => {
      return <ErrorComponent error={error} />;
    },
    defaultNotFoundComponent: () => {
      return <>Default Not Found Component</>;
    },
  });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
