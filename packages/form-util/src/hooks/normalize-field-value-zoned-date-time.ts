import type * as v from 'valibot';

import { Temporal } from '@js-temporal/polyfill';
import { useStore } from '@tanstack/react-form';
import { useMemo } from 'react';

import type { _zonedDateTimeNullable } from '#src/schemas/zoned-date-time/schema';

import { FormConversionError } from '#src/error';
import { useFieldContext } from '#src/tanstack-form.config';

type SchemaType = v.InferInput<ReturnType<typeof _zonedDateTimeNullable>>;

export type FieldValueZonedDateTime = Exclude<SchemaType, string>;

export function useNormalizeFieldValueZonedDateTime() {
  const field = useFieldContext<SchemaType>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<Temporal.ZonedDateTime | null>(() => {
    try {
      if (baseFieldValue instanceof Temporal.ZonedDateTime) {
        return baseFieldValue;
      }
    } catch (error: unknown) {
      console.error('useNormalizeFieldValueZonedDateTime - Failed to normalize value', error);
      throw new FormConversionError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueZonedDateTime - Failed to normalize value',
      });
    }

    if (typeof baseFieldValue === 'string') {
      throw new FormConversionError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueZonedDateTime - Convert from string before passing into form',
      });
    }

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      throw new FormConversionError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueZonedDateTime - Invalid type in context',
      });
    }

    return null;
  }, [baseFieldValue]);
}
