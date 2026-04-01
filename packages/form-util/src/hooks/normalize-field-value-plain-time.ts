import { Temporal } from '@js-temporal/polyfill';
import { useStore } from '@tanstack/react-form';
import { useMemo } from 'react';

import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValuePlainTime =
  | Temporal.ZonedDateTime
  | Temporal.PlainDateTime
  | Temporal.PlainTime
  | null
  | undefined;

export function useNormalizeFieldValuePlainTime() {
  const field = useFieldContext<FieldValuePlainTime>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<Temporal.PlainTime | null>(() => {
    try {
      if (baseFieldValue instanceof Temporal.ZonedDateTime) {
        return baseFieldValue.toPlainTime();
      } else if (baseFieldValue instanceof Temporal.PlainDateTime) {
        return baseFieldValue.toPlainTime();
      } else if (baseFieldValue instanceof Temporal.PlainTime) {
        return baseFieldValue;
      }
    } catch (error: unknown) {
      console.error('useNormalizeFieldValuePlainTime - Failed to normalize value', error);
      throw new Error('useNormalizeFieldValuePlainTime - Failed to normalize value', { cause: error });
    }

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      console.error('useNormalizeFieldValuePlainTime - Invalid type in context:', baseFieldValue);
      throw new Error('useNormalizeFieldValuePlainTime - Invalid type in context');
    }

    return null;
  }, [baseFieldValue]);
}
