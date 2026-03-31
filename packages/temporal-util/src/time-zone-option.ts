import { getDefaultTimeZone } from '#src/defaults';

export interface TimeZoneOptions {
  timeZone?: string;
}

export type ResolvedTimeZoneOptions = Required<TimeZoneOptions>;

export function resolveTimeZoneOptions(options: TimeZoneOptions): ResolvedTimeZoneOptions {
  return {
    timeZone: options?.timeZone ?? getDefaultTimeZone(),
  };
}
