import { getDefaultTimeZone } from '#src/defaults';

export interface TimeZoneOptions {
  timeZone: string;
}

export function resolveTimeZoneOptions(options?: Partial<TimeZoneOptions>) {
  return {
    timeZone: options?.timeZone ?? getDefaultTimeZone(),
  } satisfies TimeZoneOptions;
}
