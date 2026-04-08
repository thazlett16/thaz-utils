import type * as v from 'valibot';

import { Temporal } from '@js-temporal/polyfill';
import { useStore } from '@tanstack/react-form';
import { useMemo } from 'react';

import type { _plainTimeNullable } from '#src/schemas/plain-time/schema';

import { FormConversionError, FormTypeError } from '#src/error';
import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValuePlainTime = v.InferInput<ReturnType<typeof _plainTimeNullable>>;

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
      throw new FormConversionError(
        {
          message: 'useNormalizeFieldValuePlainTime - Failed to normalize value',
        },
        { cause: error },
      );
    }

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      throw new FormTypeError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValuePlainTime - Invalid type in context',
      });
    }

    return null;
  }, [baseFieldValue]);
}
