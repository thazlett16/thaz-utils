import type { TimeZoneOptions, ResolvedTimeZoneOptions } from '@thazstack/temporal-util';

import { resolveTimeZoneOptions } from '@thazstack/temporal-util';
import { useMemo } from 'react';

export function useTimeZoneOptions(options: TimeZoneOptions) {
  return useMemo<ResolvedTimeZoneOptions>(() => {
    return resolveTimeZoneOptions(options);
  }, [options]);
}
