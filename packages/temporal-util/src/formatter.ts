import { Intl as TemporalIntl } from '@js-temporal/polyfill';

import { getDefaultLocale } from '#src/defaults';

export interface LocaleOptions {
  locale: string | string[];
}

export function resolveLocaleOption(option?: Partial<LocaleOptions>) {
  return {
    locale: option?.locale ?? getDefaultLocale(),
  } satisfies LocaleOptions;
}

export interface DateFormatterOptions {
  year: NonNullable<Intl.DateTimeFormatOptions['year']>;
  month: NonNullable<Intl.DateTimeFormatOptions['month']>;
  day: NonNullable<Intl.DateTimeFormatOptions['day']>;
}

export function resolveDateFormatterOptions(options?: Partial<DateFormatterOptions>) {
  return {
    year: options?.year ?? 'numeric',
    month: options?.month ?? '2-digit',
    day: options?.day ?? '2-digit',
  } satisfies DateFormatterOptions;
}

export function buildDateFormatter(options?: Partial<DateFormatterOptions> & Partial<LocaleOptions>) {
  const localeOptions = resolveLocaleOption(options);
  const dateOptions = resolveDateFormatterOptions(options);

  return new TemporalIntl.DateTimeFormat(localeOptions.locale, {
    ...dateOptions,
  });
}

export interface TimeFormatterOptions {
  hour: NonNullable<Intl.DateTimeFormatOptions['hour']>;
  minute: NonNullable<Intl.DateTimeFormatOptions['minute']>;
  second: NonNullable<Intl.DateTimeFormatOptions['second']>;
  timeZoneName: NonNullable<Intl.DateTimeFormatOptions['timeZoneName']>;
}

export function resolveTimeFormatterOptions(options?: Partial<TimeFormatterOptions>) {
  return {
    hour: options?.hour ?? '2-digit',
    minute: options?.minute ?? '2-digit',
    second: options?.second ?? '2-digit',
    timeZoneName: options?.timeZoneName ?? 'short',
  } satisfies TimeFormatterOptions;
}

export function buildTimeFormatter(options?: Partial<TimeFormatterOptions> & Partial<LocaleOptions>) {
  const localeOptions = resolveLocaleOption(options);
  const timeOptions = resolveTimeFormatterOptions(options);

  return new TemporalIntl.DateTimeFormat(localeOptions.locale, {
    ...timeOptions,
  });
}

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
