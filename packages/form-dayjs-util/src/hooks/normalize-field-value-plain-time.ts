import type { FieldValuePlainTime as BaseFieldValuePlainTime } from '@thazstack/form-util';
import type { Dayjs } from 'dayjs';

import { Temporal } from '@js-temporal/polyfill';
import { useStore } from '@tanstack/react-form';
import { useFieldContext } from '@thazstack/form-util';
import { convertInstantToDayJS, convertPlainTimeToDayJS } from '@thazstack/temporal-dayjs-util';
import { useMemo } from 'react';

import { dayJS } from '#src/dayjs.config';

export type FieldValuePlainTime = BaseFieldValuePlainTime | Dayjs;

export function useNormalizeFieldValuePlainTime() {
    const field = useFieldContext<FieldValuePlainTime>();

    const baseFieldValue = useStore(field.store, (state) => state.value);

    return useMemo<null | Dayjs>(() => {
        try {
            if (baseFieldValue instanceof Temporal.ZonedDateTime) {
                return convertInstantToDayJS(baseFieldValue.toInstant()).tz(baseFieldValue.timeZoneId);
            } else if (baseFieldValue instanceof Temporal.PlainTime) {
                return convertPlainTimeToDayJS(baseFieldValue);
            } else if (dayJS.isDayjs(baseFieldValue)) {
                return baseFieldValue;
            }
        } catch (error: unknown) {
            console.error('useNormalizeFieldValuePlainTime - Failed to normalize value', error);
        }

        return null;
    }, [baseFieldValue]);
}
