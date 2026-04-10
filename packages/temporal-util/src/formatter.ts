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
 * Preferred entry point for date-only formatting with Temporal objects.
 * Uses `@js-temporal/polyfill`'s `Intl` rather than native `Intl` because only
 * the polyfill's formatter understands `Temporal.PlainDate` and related types.
 *
 * @param options - Optional date and locale format options.
 * @returns A `TemporalIntl.DateTimeFormat` instance configured for date output.
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

/** Time portion of `Intl.DateTimeFormatOptions`, all fields required. */
export interface TimeFormatterOptions {
  hour: NonNullable<Intl.DateTimeFormatOptions['hour']>;
  minute: NonNullable<Intl.DateTimeFormatOptions['minute']>;
  second: NonNullable<Intl.DateTimeFormatOptions['second']>;
  timeZoneName: NonNullable<Intl.DateTimeFormatOptions['timeZoneName']>;
}

/**
 * Provides opinionated time display defaults.
 *
 * Defaults: `hour: "2-digit"`, `minute: "2-digit"`, `second: "2-digit"`, `timeZoneName: "short"`.
 *
 * @param options - Partial time format options to resolve.
 * @returns Resolved {@link TimeFormatterOptions} with all fields populated.
 */
export function resolveTimeFormatterOptions(options?: Partial<TimeFormatterOptions>) {
  return {
    hour: options?.hour ?? '2-digit',
    minute: options?.minute ?? '2-digit',
    second: options?.second ?? '2-digit',
    timeZoneName: options?.timeZoneName ?? 'short',
  } satisfies TimeFormatterOptions;
}

/**
 * Preferred entry point for time-only formatting with Temporal objects.
 * Uses `@js-temporal/polyfill`'s `Intl` rather than native `Intl` because only
 * the polyfill's formatter understands `Temporal.PlainTime` and related types.
 *
 * @param options - Optional time and locale format options.
 * @returns A `TemporalIntl.DateTimeFormat` instance configured for time output.
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
 * Preferred entry point for combined date+time formatting with Temporal objects.
 * Uses `@js-temporal/polyfill`'s `Intl` rather than native `Intl` because only
 * the polyfill's formatter understands `Temporal.ZonedDateTime` and related types.
 *
 * @param options - Optional date, time, and locale format options.
 * @returns A `TemporalIntl.DateTimeFormat` instance configured for date+time output.
 * @see {@link buildDateFormatter}
 * @see {@link buildTimeFormatter}
 */
export function buildDateTimeFormatter(
  options?: Partial<DateFormatterOptions> & Partial<TimeFormatterOptions> & Partial<LocaleOptions>,
) {
  const localeOptions = resolveLocaleOption(options);
  const dateOptions = resolveDateFormatterOptions(options);
  const timeOptions = resolveTimeFormatterOptions(options);

  return new TemporalIntl.DateTimeFormat(localeOptions.locale, {
    ...dateOptions,
    ...timeOptions,
  });
}
