import type { FieldValuePlainDate as BaseFieldValuePlainDate } from '@thazstack/form-util';
import type { Dayjs } from 'dayjs';

import { Temporal } from '@js-temporal/polyfill';
import { useStore } from '@tanstack/react-form';
import { useFieldContext } from '@thazstack/form-util';
import {  convertInstantToDayJS, convertPlainDateToDayJS } from '@thazstack/temporal-dayjs-util';
import { useMemo } from 'react';

import { dayJS } from '#src/dayjs.config';

export type FieldValuePlainDate = BaseFieldValuePlainDate | Dayjs;

export function useNormalizeFieldValuePlainDate() {
    const field = useFieldContext<FieldValuePlainDate>();

    const baseFieldValue = useStore(field.store, (state) => state.value);

    return useMemo<null | Dayjs>(() => {
        try {
            if (baseFieldValue instanceof Temporal.ZonedDateTime) {
                return convertInstantToDayJS(baseFieldValue.toInstant()).tz(baseFieldValue.timeZoneId);
            } else if (baseFieldValue instanceof Temporal.PlainDate) {
                return convertPlainDateToDayJS(baseFieldValue);
            } else if (dayJS.isDayjs(baseFieldValue)) {
                return baseFieldValue;
            }
        } catch (error: unknown) {
            console.error('useNormalizeFieldValuePlainDate - Failed to normalize value', error);
        }

        return null;
    }, [baseFieldValue]);
}
