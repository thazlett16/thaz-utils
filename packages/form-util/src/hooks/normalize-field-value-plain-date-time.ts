import type * as v from 'valibot';

import { Temporal } from '@js-temporal/polyfill';
import { useStore } from '@tanstack/react-form';
import { useMemo } from 'react';

import type { _plainDateTimeNullable } from '#src/schemas/plain-date-time/schema';

import { FormConversionError } from '#src/error';
import { useFieldContext } from '#src/tanstack-form.config';

type SchemaType = v.InferInput<ReturnType<typeof _plainDateTimeNullable>>;

export type FieldValuePlainDateTime = Exclude<SchemaType, string>;

export function useNormalizeFieldValuePlainDateTime() {
  const field = useFieldContext<SchemaType>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<Temporal.PlainDateTime | null>(() => {
    try {
      if (baseFieldValue instanceof Temporal.ZonedDateTime) {
        return baseFieldValue.toPlainDateTime();
      } else if (baseFieldValue instanceof Temporal.PlainDateTime) {
        return baseFieldValue;
      }
    } catch (error: unknown) {
      console.error('useNormalizeFieldValuePlainDateTime - Failed to normalize value', error);
      throw new FormConversionError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValuePlainDateTime - Failed to normalize value',
      });
    }

    if (typeof baseFieldValue === 'string') {
      throw new FormConversionError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValuePlainDateTime - Convert from string before passing into form',
      });
    }

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      throw new FormConversionError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValuePlainDateTime - Invalid type in context',
      });
    }

    return null;
  }, [baseFieldValue]);
}
