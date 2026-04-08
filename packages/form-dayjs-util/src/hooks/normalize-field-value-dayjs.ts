import type { Dayjs } from 'dayjs';

import { Temporal } from '@js-temporal/polyfill';
import { useStore } from '@tanstack/react-form';
import { useFieldContext } from '@thazstack/form-util';
import {
    convertInstantToDayJS,
    convertStringToDayJS,
    convertPlainDateToDayJS,
    convertPlainTimeToDayJS,
} from '@thazstack/temporal-dayjs-util';
import { useMemo } from 'react';

import { dayJS } from '#src/dayjs.config';

export type FieldValueDayjs =
    | string
    | Temporal.ZonedDateTime
    | Temporal.Instant
    | Temporal.PlainDate
    | Temporal.PlainTime
    | Dayjs
    | null
    | undefined;

export function useNormalizeFieldValueDayJS() {
    const field = useFieldContext<FieldValueDayjs>();

    const baseFieldValue = useStore(field.store, (state) => state.value);

    return useMemo<null | Dayjs>(() => {
        try {
            if (typeof baseFieldValue === 'string') {
                return convertStringToDayJS(baseFieldValue);
            } else if (baseFieldValue instanceof Temporal.ZonedDateTime) {
                return convertInstantToDayJS(baseFieldValue.toInstant());
            } else if (baseFieldValue instanceof Temporal.Instant) {
                return convertInstantToDayJS(baseFieldValue);
            } else if (baseFieldValue instanceof Temporal.PlainDate) {
                return convertPlainDateToDayJS(baseFieldValue);
            } else if (baseFieldValue instanceof Temporal.PlainTime) {
                return convertPlainTimeToDayJS(baseFieldValue);
            } else if (dayJS.isDayjs(baseFieldValue)) {
                return baseFieldValue;
            }
        } catch (error: unknown) {
            console.error('useNormalizeFieldValueDayJS - Failed to normalize value', error);
        }

        return null;
    }, [baseFieldValue]);
}
