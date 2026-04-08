import type { Dayjs } from 'dayjs';

import { Temporal } from '@js-temporal/polyfill';

import { dayJS } from '#src/dayjs.config';

export function convertDayJSToPlainDateTime(input: Dayjs) {
    return new Temporal.PlainDateTime(
        input.year(),
        input.month() + 1,
        input.date(),
        input.hour(),
        input.minute(),
        input.second(),
        input.millisecond(),
    );
}

export function convertPlainDateTimeToDayJS(input: Temporal.PlainDateTime) {
    return dayJS({
        years: input.year,
        months: input.month - 1,
        dates: input.day,
        hours: input.hour,
        minutes: input.minute,
        seconds: input.second,
        milliseconds: input.millisecond,
    });
}
