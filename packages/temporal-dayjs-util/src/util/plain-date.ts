import type { Dayjs } from 'dayjs';

import { Temporal } from '@js-temporal/polyfill';

import { dayJS } from '#src/dayjs.config';

export function convertDayJSToPlainDate(input: Dayjs) {
    return new Temporal.PlainDate(input.year(), input.month() + 1, input.date());
}

export function convertPlainDateToDayJS(input: Temporal.PlainDate) {
    return dayJS({
        years: input.year,
        months: input.month - 1,
        dates: input.day,
    });
}
