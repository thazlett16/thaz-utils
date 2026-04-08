import type * as v from 'valibot';

import { Temporal } from '@js-temporal/polyfill';
import { useStore } from '@tanstack/react-form';
import { useMemo } from 'react';

import type { _instantNullable } from '#src/schemas/instant/schema';

import { FormConversionError } from '#src/error';
import { useFieldContext } from '#src/tanstack-form.config';

type SchemaType = v.InferInput<ReturnType<typeof _instantNullable>>;

export type FieldValueInstant = Exclude<SchemaType, string>;

export function useNormalizeFieldValueInstant() {
  const field = useFieldContext<SchemaType>();

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
      throw new FormConversionError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueInstant - Failed to normalize value',
      });
    }

    if (typeof baseFieldValue === 'string') {
      throw new FormConversionError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueInstant - Convert from string before passing into form',
      });
    }

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      throw new FormConversionError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueInstant - Invalid type in context',
      });
    }

    return null;
  }, [baseFieldValue]);
}
