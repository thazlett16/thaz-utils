import type * as v from 'valibot';

import { Temporal } from '@js-temporal/polyfill';
import { useStore } from '@tanstack/react-form';
import { useMemo } from 'react';

import type { _plainTimeNullable } from '#src/schemas/plain-time/schema';

import { FormConversionError } from '#src/error';
import { useFieldContext } from '#src/tanstack-form.config';

type SchemaType = v.InferInput<ReturnType<typeof _plainTimeNullable>>;

export type FieldValuePlainTime = Exclude<SchemaType, string>;

export function useNormalizeFieldValuePlainTime() {
  const field = useFieldContext<SchemaType>();

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
      throw new FormConversionError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValuePlainTime - Failed to normalize value',
      });
    }

    if (typeof baseFieldValue === 'string') {
      throw new FormConversionError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValuePlainTime - Convert from string before passing into form',
      });
    }

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      throw new FormConversionError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValuePlainTime - Invalid type in context',
      });
    }

    return null;
  }, [baseFieldValue]);
}
