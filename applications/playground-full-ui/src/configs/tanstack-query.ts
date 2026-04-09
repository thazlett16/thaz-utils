import { Temporal } from '@js-temporal/polyfill';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Temporal.Duration.from({
          seconds: 10,
        }).total({
          unit: 'milliseconds',
        }),
        gcTime: Temporal.Duration.from({
          minutes: 5,
        }).total({
          unit: 'milliseconds',
        }),
      },
    },
    queryCache: new QueryCache({
      // onSuccess: () => {},
      // onError: () => {},
      // onSettled: () => {},
    }),
    mutationCache: new MutationCache({
      // onMutate: () => {},
      // onSuccess: () => {},
      // onError: () => {},
      // onSettled: () => {},
    }),
  });
}
