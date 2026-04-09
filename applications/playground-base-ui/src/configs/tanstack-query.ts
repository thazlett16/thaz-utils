import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

export function createQueryClient() {
  return new QueryClient({
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
