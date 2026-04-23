import { Intl as TemporalIntl } from '@js-temporal/polyfill';

import { getDefaultLocale } from '#src/defaults';

/** BCP 47 locale or list of locales passed to {@link TemporalIntl.DateTimeFormat}. */
export interface LocaleOptions {
  locale: string | string[];
}

/**
 * Ensures a valid locale is always present before passing to `Intl.DateTimeFormat`,
 * which throws a `RangeError` if locale is `undefined`.
 *
 * @param option - Partial locale options to resolve.
 * @returns Resolved {@link LocaleOptions} with a guaranteed `locale` value.
 */
export function resolveLocaleOption(option?: Partial<LocaleOptions>) {
  return {
    locale: option?.locale ?? getDefaultLocale(),
  } satisfies LocaleOptions;
}

/** Date portion of `Intl.DateTimeFormatOptions`, all fields required. */
export interface DateFormatterOptions {
  year: NonNullable<Intl.DateTimeFormatOptions['year']>;
  month: NonNullable<Intl.DateTimeFormatOptions['month']>;
  day: NonNullable<Intl.DateTimeFormatOptions['day']>;
}

/**
 * Provides opinionated date display defaults.
 *
 * Defaults: `year: "numeric"`, `month: "2-digit"`, `day: "2-digit"`.
 *
 * @param options - Partial date format options to resolve.
 * @returns Resolved {@link DateFormatterOptions} with all fields populated.
 */
export function resolveDateFormatterOptions(options?: Partial<DateFormatterOptions>) {
  return {
    year: options?.year ?? 'numeric',
    month: options?.month ?? '2-digit',
    day: options?.day ?? '2-digit',
  } satisfies DateFormatterOptions;
}

/**
 * Use when you need to display only the date portion of a Temporal value.
 * Uses `@js-temporal/polyfill`'s `Intl` rather than native `Intl` because only
 * the polyfill's formatter understands Temporal types.
 *
 * Compatible with `Temporal.PlainDate`, `Temporal.PlainDateTime`, and
 * `Temporal.ZonedDateTime` (date portion only).
 *
 * @param options - Optional date and locale format options.
 * @returns A `TemporalIntl.DateTimeFormat` instance configured for date-only output.
 * @see {@link buildTimeFormatter}
 * @see {@link buildDateTimeFormatter}
 */
export function buildDateFormatter(options?: Partial<DateFormatterOptions> & Partial<LocaleOptions>) {
  const localeOptions = resolveLocaleOption(options);
  const dateOptions = resolveDateFormatterOptions(options);

  return new TemporalIntl.DateTimeFormat(localeOptions.locale, {
    ...dateOptions,
  });
}

/**
 * Time portion of `Intl.DateTimeFormatOptions`, scoped to the three display fields.
 * `timeZoneName` is intentionally excluded so formatters built from this interface
 * are always safe to use with `Temporal.PlainTime`, which throws if any time zone
 * option is present.
 */
export interface TimeFormatterOptions {
  hour: NonNullable<Intl.DateTimeFormatOptions['hour']>;
  minute: NonNullable<Intl.DateTimeFormatOptions['minute']>;
  second: NonNullable<Intl.DateTimeFormatOptions['second']>;
}

/**
 * Provides opinionated time display defaults.
 *
 * Defaults: `hour: "2-digit"`, `minute: "2-digit"`, `second: "2-digit"`.
 *
 * @param options - Partial time format options to resolve.
 * @returns Resolved {@link TimeFormatterOptions} with all fields populated.
 */
export function resolveTimeFormatterOptions(options?: Partial<TimeFormatterOptions>) {
  return {
    hour: options?.hour ?? '2-digit',
    minute: options?.minute ?? '2-digit',
    second: options?.second ?? '2-digit',
  } satisfies TimeFormatterOptions;
}

/**
 * Use when you need to display only the time portion of a Temporal value without
 * any timezone context. Uses `@js-temporal/polyfill`'s `Intl` rather than native
 * `Intl` because only the polyfill's formatter understands Temporal types.
 *
 * Compatible with `Temporal.PlainTime` and `Temporal.PlainDateTime`. Do **not**
 * use for `Temporal.ZonedDateTime` when the zone should be visible — use
 * {@link buildDateTimeFormatter} instead.
 *
 * @param options - Optional time and locale format options.
 * @returns A `TemporalIntl.DateTimeFormat` instance configured for time-only output.
 * @see {@link buildDateFormatter}
 * @see {@link buildDateTimeFormatter}
 */
export function buildTimeFormatter(options?: Partial<TimeFormatterOptions> & Partial<LocaleOptions>) {
  const localeOptions = resolveLocaleOption(options);
  const timeOptions = resolveTimeFormatterOptions(options);

  return new TemporalIntl.DateTimeFormat(localeOptions.locale, {
    ...timeOptions,
  });
}

/**
 * Controls how the IANA time zone abbreviation is rendered in
 * {@link TemporalIntl.DateTimeFormat} output. Required by {@link buildDateTimeFormatter}
 * to guarantee the zone is always visible when formatting a `Temporal.ZonedDateTime`.
 */
export interface TimeZoneNameFormatterOptions {
  timeZoneName: NonNullable<Intl.DateTimeFormatOptions['timeZoneName']>;
}

/**
 * Provides an opinionated default for time zone name display.
 *
 * Default: `timeZoneName: "short"` (e.g. `"EST"`, `"PDT"`).
 *
 * @param options - Partial time zone name options to resolve.
 * @returns Resolved {@link TimeZoneNameFormatterOptions} with a guaranteed `timeZoneName` value.
 */
export function resolveTimeZoneNameFormatterOptions(options?: Partial<TimeZoneNameFormatterOptions>) {
  return {
    timeZoneName: options?.timeZoneName ?? 'short',
  } satisfies TimeZoneNameFormatterOptions;
}

/**
 * Use when you need to display both date and time alongside the time zone for a
 * `Temporal.ZonedDateTime`. Uses `@js-temporal/polyfill`'s `Intl` rather than
 * native `Intl` because only the polyfill's formatter understands Temporal types.
 *
 * **Important:** because `timeZoneName` is always included (defaulting to `"short"`
 * via {@link resolveTimeZoneNameFormatterOptions}), this formatter is **only** compatible
 * with `Temporal.ZonedDateTime`. Passing a plain type such as `Temporal.PlainDateTime`
 * will throw a `TypeError` at format time. Use {@link buildDateFormatter} or
 * {@link buildTimeFormatter} for plain types.
 *
 * @param options - Optional date, time, time zone name, and locale format options.
 * @returns A `TemporalIntl.DateTimeFormat` instance configured for date+time+zone output.
 * @see {@link buildDateFormatter}
 * @see {@link buildTimeFormatter}
 */
export function buildDateTimeFormatter(
  options?: Partial<DateFormatterOptions> &
    Partial<TimeFormatterOptions> &
    Partial<TimeZoneNameFormatterOptions> &
    Partial<LocaleOptions>,
) {
  const localeOptions = resolveLocaleOption(options);
  const dateOptions = resolveDateFormatterOptions(options);
  const timeOptions = resolveTimeFormatterOptions(options);
  const timeZoneNameOptions = resolveTimeZoneNameFormatterOptions(options);

  return new TemporalIntl.DateTimeFormat(localeOptions.locale, {
    ...dateOptions,
    ...timeOptions,
    ...timeZoneNameOptions,
  });
}
