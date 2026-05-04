import { useMemo } from 'react';

import { useStore } from '@tanstack/react-form';

import { Temporal } from '@js-temporal/polyfill';
import type * as v from 'valibot';

import { FormConversionError, FormTypeError } from '#src/error';
import type { _plainDateTimeNullable } from '#src/schemas/plain-date-time';
import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValuePlainDateTime = v.InferInput<ReturnType<typeof _plainDateTimeNullable>>;

export function normalizeFieldValuePlainDateTime(value: FieldValuePlainDateTime): Temporal.PlainDateTime | null {
  try {
    if (value instanceof Temporal.ZonedDateTime) {
      return value.toPlainDateTime();
    } else if (value instanceof Temporal.PlainDateTime) {
      return value;
    }
  } catch (error: unknown) {
    throw new FormConversionError(
      {
        message: 'useNormalizeFieldValuePlainDateTime - Failed to normalize value',
      },
      { cause: error },
    );
  }

  if (!(value === null || value === undefined)) {
    throw new FormTypeError({
      data: value,
      message: 'useNormalizeFieldValuePlainDateTime - Invalid type in context',
    });
  }

  return null;
}

export function useNormalizeFieldValuePlainDateTime() {
  const field = useFieldContext<FieldValuePlainDateTime>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo(() => normalizeFieldValuePlainDateTime(baseFieldValue), [baseFieldValue]);
}
