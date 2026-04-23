import { useMemo } from 'react';

import type { TimeZoneOptions } from '@thazstack/temporal-util';
import { resolveTimeZoneOptions } from '@thazstack/temporal-util';

export function useTimeZoneOptions(options?: Readonly<TimeZoneOptions>) {
  return useMemo(() => {
    return resolveTimeZoneOptions(options);
  }, [options]);
}
