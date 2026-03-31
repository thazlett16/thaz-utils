import { Temporal } from '@js-temporal/polyfill';
import { useStore } from '@tanstack/react-form';
import { useMemo } from 'react';

import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValuePlainDateTime = Temporal.ZonedDateTime | Temporal.PlainDateTime | null | undefined;

export function useNormalizeFieldValuePlainDateTime() {
  const field = useFieldContext<FieldValuePlainDateTime>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<null | Temporal.PlainDateTime>(() => {
    try {
      if (baseFieldValue instanceof Temporal.ZonedDateTime) {
        return baseFieldValue.toPlainDateTime();
      } else if (baseFieldValue instanceof Temporal.PlainDateTime) {
        return baseFieldValue;
      }
    } catch (error: unknown) {
      console.error('useNormalizeFieldValuePlainDateTime - Failed to normalize value', error);
    }

    return null;
  }, [baseFieldValue]);
}
