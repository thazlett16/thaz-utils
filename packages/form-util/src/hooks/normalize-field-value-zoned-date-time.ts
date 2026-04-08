import { Temporal } from '@js-temporal/polyfill';
import { useStore } from '@tanstack/react-form';
import { getDefaultTimeZone } from '@thazstack/temporal-util';
import { useMemo } from 'react';

import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValueZonedDateTime = Temporal.ZonedDateTime | Temporal.Instant | null | undefined;

export interface NormalizeFieldValueZonedDateTimeOptions {
    timeZone?: string;
}

export type ResolvedNormalizeFieldValueZonedDateTimeOptions = Required<NormalizeFieldValueZonedDateTimeOptions>;

export function useNormalizeFieldValueZonedDateTimeOptions(options: NormalizeFieldValueZonedDateTimeOptions) {
    return useMemo<ResolvedNormalizeFieldValueZonedDateTimeOptions>(() => {
        return {
            timeZone: options?.timeZone ?? getDefaultTimeZone(),
        };
    }, [options]);
}

export function useNormalizeFieldValueZonedDateTime(options: NormalizeFieldValueZonedDateTimeOptions) {
    const resolvedNormalizeFieldValueZonedDateTimeOptions = useNormalizeFieldValueZonedDateTimeOptions(options);

    const field = useFieldContext<FieldValueZonedDateTime>();

    const baseFieldValue = useStore(field.store, (state) => state.value);

    return useMemo<null | Temporal.ZonedDateTime>(() => {
        try {
            if (baseFieldValue instanceof Temporal.ZonedDateTime) {
                return baseFieldValue;
            } else if (baseFieldValue instanceof Temporal.Instant) {
                return baseFieldValue.toZonedDateTimeISO(resolvedNormalizeFieldValueZonedDateTimeOptions.timeZone);
            }
        } catch (error: unknown) {
            console.error('useNormalizeFieldValueZonedDateTime - Failed to normalize value', error);
        }

        return null;
    }, [baseFieldValue, resolvedNormalizeFieldValueZonedDateTimeOptions]);
}
