import { useMemo } from 'react';

import { useStore } from '@tanstack/react-form';

import type * as v from 'valibot';

import { Temporal } from '@js-temporal/polyfill';

import type { _plainDateTimeNullable } from '#src/schemas/plain-date-time/plain-date-time';

import { FormConversionError, FormTypeError } from '#src/error';
import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValuePlainDateTime = v.InferInput<ReturnType<typeof _plainDateTimeNullable>>;

export function useNormalizeFieldValuePlainDateTime() {
  const field = useFieldContext<FieldValuePlainDateTime>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<Temporal.PlainDateTime | null>(() => {
    try {
      if (baseFieldValue instanceof Temporal.ZonedDateTime) {
        return baseFieldValue.toPlainDateTime();
      } else if (baseFieldValue instanceof Temporal.PlainDateTime) {
        return baseFieldValue;
      }
    } catch (error: unknown) {
      throw new FormConversionError(
        {
          message: 'useNormalizeFieldValuePlainDateTime - Failed to normalize value',
        },
        { cause: error },
      );
    }

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      throw new FormTypeError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValuePlainDateTime - Invalid type in context',
      });
    }

    return null;
  }, [baseFieldValue]);
}
