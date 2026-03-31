import { Temporal } from '@js-temporal/polyfill';
import { useStore } from '@tanstack/react-form';
import { useMemo } from 'react';

import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValueZonedDateTime = Temporal.ZonedDateTime | null | undefined;

export function useNormalizeFieldValueZonedDateTime() {
  const field = useFieldContext<FieldValueZonedDateTime>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<null | Temporal.ZonedDateTime>(() => {
    try {
      if (baseFieldValue instanceof Temporal.ZonedDateTime) {
        return baseFieldValue;
      }
    } catch (error: unknown) {
      console.error('useNormalizeFieldValueZonedDateTime - Failed to normalize value', error);
    }

    return null;
  }, [baseFieldValue]);
}
