import type { TimeZoneOptions } from '@thazstack/temporal-util';

import { resolveTimeZoneOptions } from '@thazstack/temporal-util';
import { useMemo } from 'react';

export function useTimeZoneOptions(options?: Readonly<TimeZoneOptions>) {
  return useMemo(() => {
    return resolveTimeZoneOptions(options);
  }, [options]);
}
