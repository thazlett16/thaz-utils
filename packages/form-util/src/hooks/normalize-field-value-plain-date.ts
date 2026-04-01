import { Temporal } from '@js-temporal/polyfill';
import { useStore } from '@tanstack/react-form';
import { useMemo } from 'react';

import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValuePlainDate =
  | Temporal.ZonedDateTime
  | Temporal.PlainDateTime
  | Temporal.PlainDate
  | null
  | undefined;

export function useNormalizeFieldValuePlainDate() {
  const field = useFieldContext<FieldValuePlainDate>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<Temporal.PlainDate | null>(() => {
    try {
      if (baseFieldValue instanceof Temporal.ZonedDateTime) {
        return baseFieldValue.toPlainDate();
      } else if (baseFieldValue instanceof Temporal.PlainDateTime) {
        return baseFieldValue.toPlainDate();
      } else if (baseFieldValue instanceof Temporal.PlainDate) {
        return baseFieldValue;
      }
    } catch (error: unknown) {
      console.error('useNormalizeFieldValuePlainDate - Failed to normalize value', error);
      throw new Error('useNormalizeFieldValuePlainDate - Failed to normalize value', { cause: error });
    }

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      console.error('useNormalizeFieldValuePlainDate - Invalid type in context:', baseFieldValue);
      throw new Error('useNormalizeFieldValuePlainDate - Invalid type in context');
    }

    return null;
  }, [baseFieldValue]);
}
