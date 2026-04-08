import type { Dayjs } from 'dayjs';

import { Temporal } from '@js-temporal/polyfill';

import { dayJS } from '#src/dayjs.config';

export function convertDayJSToPlainTime(input: Dayjs) {
    return new Temporal.PlainTime(input.hour(), input.minute(), input.second(), input.millisecond());
}

export function convertPlainTimeToDayJS(input: Temporal.PlainTime) {
    return dayJS({
        hours: input.hour,
        minutes: input.minute,
        seconds: input.second,
        milliseconds: input.millisecond,
    });
}
