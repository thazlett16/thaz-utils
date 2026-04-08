import { Intl as TemporalIntl } from '@js-temporal/polyfill';

import { getDefaultLocale } from '#src/defaults';

export interface LocaleOption {
    locale?: string | string[];
}
export type DateFormatterOptions = Pick<Intl.DateTimeFormatOptions, 'year' | 'month' | 'day'> & LocaleOption;
export type TimeFormatterOptions = Pick<Intl.DateTimeFormatOptions, 'hour' | 'minute' | 'second' | 'timeZoneName'> &
    LocaleOption;
export type DateTimeFormatterOptions = DateFormatterOptions & TimeFormatterOptions;

export function resolvedLocaleOption(option: LocaleOption) {
    return option.locale ?? getDefaultLocale();
}

export function resolvedDateFormatterOptions(options: DateFormatterOptions) {
    const year = options.year ?? 'numeric';
    const month = options.year ?? '2-digit';
    const day = options.year ?? '2-digit';

    return {
        year,
        month,
        day,
    };
}

export function resolvedTimeFormatterOptions(options: TimeFormatterOptions) {
    const hour = options.hour ?? '2-digit';
    const minute = options.minute ?? '2-digit';
    const second = options.second ?? '2-digit';
    const timeZoneName = options.timeZoneName ?? 'short';

    return {
        hour,
        minute,
        second,
        timeZoneName,
    };
}

export function buildDateFormatter(options: DateFormatterOptions = {}) {
    const locale = resolvedLocaleOption(options);
    const dateOptions = resolvedDateFormatterOptions(options);

    return new TemporalIntl.DateTimeFormat(locale, {
        ...dateOptions,
    });
}

export function buildTimeFormatter(options: TimeFormatterOptions = {}) {
    const locale = resolvedLocaleOption(options);
    const timeOptions = resolvedTimeFormatterOptions(options);

    return new TemporalIntl.DateTimeFormat(locale, {
        ...timeOptions,
    });
}

export function buildDateTimeFormatter(options: DateTimeFormatterOptions = {}) {
    const locale = resolvedLocaleOption(options);
    const dateOptions = resolvedDateFormatterOptions(options);
    const timeOptions = resolvedTimeFormatterOptions(options);

    return new TemporalIntl.DateTimeFormat(locale, {
        ...dateOptions,
        ...timeOptions,
    });
}
