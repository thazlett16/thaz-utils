import { Temporal } from '@js-temporal/polyfill';
import { useStore } from '@tanstack/react-form';
import { useMemo } from 'react';

import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValueInstant = Temporal.ZonedDateTime | Temporal.Instant | null | undefined;

export function useNormalizeFieldValueInstant() {
  const field = useFieldContext<FieldValueInstant>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<Temporal.Instant | null>(() => {
    try {
      if (baseFieldValue instanceof Temporal.ZonedDateTime) {
        return baseFieldValue.toInstant();
      } else if (baseFieldValue instanceof Temporal.Instant) {
        return baseFieldValue;
      }
    } catch (error: unknown) {
      console.error('useNormalizeFieldValueInstant - Failed to normalize value', error);
      throw new Error('useNormalizeFieldValueInstant - Failed to normalize value', { cause: error });
    }

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      console.error('useNormalizeFieldValueInstant - Invalid type in context:', baseFieldValue);
      throw new Error('useNormalizeFieldValueInstant - Invalid type in context');
    }

    return null;
  }, [baseFieldValue]);
}
