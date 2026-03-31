import type { DefaultError, QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query';
import type { defaultOptions } from 'spin-delay';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useDeferredValue } from 'react';
import { useSpinDelay } from 'spin-delay';
import { useDeepCompareMemo } from 'use-deep-compare';

/**
 * blog here for details:
 * https://www.teemutaskula.com/blog/exploring-query-suspense
 *
 * @param options These options come from tanstack/query Suspense options
 * @param spinDelayOptions These optional options are provided to spinDelay
 */
export function useSuspenseQueryDeferred<
  TQueryFunctionData = unknown,
  TError = DefaultError,
  TData = TQueryFunctionData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseSuspenseQueryOptions<TQueryFunctionData, TError, TData, TQueryKey>,
  spinDelayOptions?: Partial<typeof defaultOptions>,
): {
  isSuspending: boolean;
  query: UseSuspenseQueryResult<TData, TError>;
} {
  const queryKey = useDeepCompareMemo(() => {
    return options.queryKey;
  }, [options.queryKey]);

  const deferredQueryKey = useDeferredValue(queryKey);

  const query = useSuspenseQuery({
    ...options,
    queryKey: deferredQueryKey,
  });

  const isSuspending = useSpinDelay(queryKey !== deferredQueryKey, spinDelayOptions);

  return {
    isSuspending,
    query,
  };
}
