import type { RenderOptions, RenderResult } from 'vitest-browser-react';
import { render } from 'vitest-browser-react';

import type { ReactElement } from 'react';
import { Fragment } from 'react';

import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import type { RegisteredRouter, RouterHistory } from '@tanstack/react-router';
import { createMemoryHistory, RouterContextProvider } from '@tanstack/react-router';

import { createQueryClient } from '#src/configs/tanstack-query';
import { getRouter } from '#src/configs/tanstack-router';

export interface RenderWithProvidersOptions extends RenderOptions {
  historyOpts?: Parameters<typeof createMemoryHistory>[0];
  history?: RouterHistory;
  queryClient?: QueryClient;
  router?: RegisteredRouter;
}

export interface RenderWithProvidersResult extends RenderResult {
  history: RouterHistory;
  queryClient: QueryClient;
  router: RegisteredRouter;
}

export async function renderWithProviders(
  ui: ReactElement,
  {
    historyOpts,
    history = createMemoryHistory(historyOpts),
    queryClient = createQueryClient(),
    router = getRouter({ history, queryClient }),
    wrapper: Wrapper = Fragment,
    ...options
  }: RenderWithProvidersOptions = {},
): Promise<RenderWithProvidersResult> {
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
