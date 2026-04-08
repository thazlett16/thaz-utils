import { Temporal } from '@js-temporal/polyfill';
import { useStore } from '@tanstack/react-form';
import { useMemo } from 'react';

import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValuePlainDate = Temporal.ZonedDateTime | Temporal.PlainDate | null | undefined;

export function useNormalizeFieldValuePlainDate() {
    const field = useFieldContext<FieldValuePlainDate>();

    const baseFieldValue = useStore(field.store, (state) => state.value);

    return useMemo<null | Temporal.PlainDate>(() => {
        try {
            if (baseFieldValue instanceof Temporal.ZonedDateTime) {
                return baseFieldValue.toPlainDate();
            } else if (baseFieldValue instanceof Temporal.PlainDate) {
                return baseFieldValue;
            }
        } catch (error: unknown) {
            console.error('useNormalizeFieldValuePlainDate - Failed to normalize value', error);
        }

        return null;
    }, [baseFieldValue]);
}
