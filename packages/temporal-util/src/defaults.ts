/**
 * Centralizes environment-locale detection so Temporal formatters always have
 * a consistent calendar fallback without callers querying `Intl` themselves.
 *
 * @returns Calendar identifier string (e.g. `"gregory"`).
 */
export function getDefaultCalendar() {
  return new Intl.DateTimeFormat().resolvedOptions().calendar;
}

/**
 * Centralizes environment-locale detection so Temporal formatters always have
 * a consistent time zone fallback without callers querying `Intl` themselves.
 *
 * @returns IANA time zone string (e.g. `"America/New_York"`).
 */
export function getDefaultTimeZone() {
  return new Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Centralizes environment-locale detection so Temporal formatters always have
 * a consistent locale fallback without callers querying `Intl` themselves.
 *
 * @returns BCP 47 locale string (e.g. `"en-US"`).
 */
export function getDefaultLocale() {
  return new Intl.DateTimeFormat().resolvedOptions().locale;
}
