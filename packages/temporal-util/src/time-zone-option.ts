import { getDefaultTimeZone } from '#src/defaults';

/** IANA time zone string required by {@link resolveTimeZoneOptions}. */
export interface TimeZoneOptions {
  timeZone: string;
}

/**
 * Ensures an explicit time zone is always present for Temporal operations.
 *
 * @param options - Optional partial time zone options to resolve.
 * @returns Resolved {@link TimeZoneOptions} with a guaranteed `timeZone` value.
 */
export function resolveTimeZoneOptions(options?: Partial<TimeZoneOptions>) {
  return {
    timeZone: options?.timeZone ?? getDefaultTimeZone(),
  } satisfies TimeZoneOptions;
}
