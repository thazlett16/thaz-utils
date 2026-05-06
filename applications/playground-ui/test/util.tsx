import type { RenderOptions, RenderResult } from 'vitest-browser-react';
import { render } from 'vitest-browser-react';

import { Fragment } from 'react';

import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import type { RegisteredRouter, RouterHistory } from '@tanstack/react-router';
import { createMemoryHistory, RouterContextProvider } from '@tanstack/react-router';

import type { RequestHandler } from 'msw';

import { worker } from '#mock/browser';
import { createQueryClient } from '#src/configs/tanstack-query';
import { getRouter } from '#src/configs/tanstack-router';

export interface RenderWithProvidersOptions extends RenderOptions {
  queryClient?: QueryClient;
  historyOpts?: Parameters<typeof createMemoryHistory>[0];
  history?: RouterHistory;
  router?: RegisteredRouter;
  handlers?: RequestHandler[];
}

interface RenderWithProvidersResult extends RenderResult {
  queryClient: QueryClient;
  history: RouterHistory;
  router: RegisteredRouter;
}

export async function renderWithProviders(
  ui: React.ReactElement,
  {
    queryClient = createQueryClient(),
    historyOpts,
    history = createMemoryHistory(historyOpts),
    router = getRouter({ history, queryClient }),
    handlers,
    wrapper: Wrapper = Fragment,
    ...options
  }: RenderWithProvidersOptions = {},
): Promise<RenderWithProvidersResult> {
  if (handlers) {
    worker.use(...handlers);
  }

  return {
    queryClient,
    history,
    router,
    ...(await render(ui, {
      ...options,
      wrapper({ children }) {
        return (
          <RouterContextProvider router={router}>
            <QueryClientProvider client={queryClient}>
              <Wrapper>{children}</Wrapper>
            </QueryClientProvider>
          </RouterContextProvider>
        );
      },
    })),
  };
}
