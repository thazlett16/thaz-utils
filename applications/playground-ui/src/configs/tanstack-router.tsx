import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import type { RouterHistory } from '@tanstack/react-router';
import { createRouter, ErrorComponent, createBrowserHistory } from '@tanstack/react-router';

import { createQueryClient } from '#src/configs/tanstack-query';
import { routeTree } from '#src/route-tree.gen';

export interface TanStackRouterContext {
  queryClient: QueryClient;
}

export interface GetRouterOptions {
  queryClient?: QueryClient;
  history?: RouterHistory;
}

export function getRouter(options?: GetRouterOptions) {
  const queryClient = options?.queryClient ?? createQueryClient();
  const history = options?.history ?? createBrowserHistory();

  return createRouter({
    routeTree,
    history,
    basepath: '/playground-ui',
    routeMasks: [],
    search: {
      strict: true,
    },
    context: {
      queryClient,
    },
    scrollRestoration: true,
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
    router: ReturnType<typeof getRouter>;
  }
}
