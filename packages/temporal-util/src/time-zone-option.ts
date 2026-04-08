import { getDefaultTimeZone } from '#src/defaults';

export interface TimeZoneOptions {
  timeZone?: string;
}

export function resolveTimeZoneOptions(options?: TimeZoneOptions): Required<TimeZoneOptions> {
  return {
    timeZone: options?.timeZone ?? getDefaultTimeZone(),
  };
}
