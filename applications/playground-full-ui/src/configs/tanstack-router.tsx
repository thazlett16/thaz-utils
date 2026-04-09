import type { QueryClient } from '@tanstack/react-query';

import { QueryClientProvider } from '@tanstack/react-query';
import { createRouter as tanStackCreateRouter, ErrorComponent } from '@tanstack/react-router';

import { createQueryClient } from '#src/configs/tanstack-query';
import { routeTree } from '#src/route-tree.gen';

export interface TanStackRouterContext {
  queryClient: QueryClient;
}

export function createRouter() {
  const queryClient = createQueryClient();

  return tanStackCreateRouter({
    routeTree,
    basepath: '/playground-full-ui',
    routeMasks: [],
    search: {
      strict: true,
    },
    context: {
      queryClient,
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
    Wrap: ({ children }) => {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    },
  });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
