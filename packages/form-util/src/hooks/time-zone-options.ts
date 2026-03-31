import { getDefaultTimeZone } from '@thazstack/temporal-util';
import { useMemo } from 'react';

export interface TimeZoneOptions {
  timeZone?: string;
}

export type ResolvedTimeZoneOptions = Required<TimeZoneOptions>;

export function useTimeZoneOptions(options: TimeZoneOptions) {
  return useMemo<ResolvedTimeZoneOptions>(() => {
    return {
      timeZone: options?.timeZone ?? getDefaultTimeZone(),
    };
  }, [options]);
}
