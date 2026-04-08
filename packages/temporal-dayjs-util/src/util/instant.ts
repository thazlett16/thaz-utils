import type { Dayjs } from 'dayjs';

import { Temporal } from '@js-temporal/polyfill';

import { dayJS } from '#src/dayjs.config';

export function convertDayJSToInstant(input: Dayjs) {
    return Temporal.Instant.from(input.toISOString());
}

export function convertInstantToDayJS(input: Temporal.Instant) {
    return dayJS.utc(input.toString());
}
