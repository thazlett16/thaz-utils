import type * as v from 'valibot';

import { Temporal } from '@js-temporal/polyfill';
import { useStore } from '@tanstack/react-form';
import { useMemo } from 'react';

import type { _plainDateNullable } from '#src/schemas/plain-date/plain-date';

import { FormConversionError, FormTypeError } from '#src/error';
import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValuePlainDate = v.InferInput<ReturnType<typeof _plainDateNullable>>;

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
      throw new FormConversionError(
        {
          message: 'useNormalizeFieldValuePlainDate - Failed to normalize value',
        },
        { cause: error },
      );
    }

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      throw new FormTypeError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValuePlainDate - Invalid type in context',
      });
    }

    return null;
  }, [baseFieldValue]);
}
