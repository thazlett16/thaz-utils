import { useMemo } from 'react';

import { useStore } from '@tanstack/react-form';

import { Temporal } from '@js-temporal/polyfill';
import type * as v from 'valibot';

import { FormConversionError, FormTypeError } from '#src/error';
import type { _plainDateNullable } from '#src/schemas/plain-date';
import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValuePlainDate = v.InferInput<ReturnType<typeof _plainDateNullable>>;

export function normalizeFieldValuePlainDate(value: FieldValuePlainDate): Temporal.PlainDate | null {
  try {
    if (value instanceof Temporal.ZonedDateTime) {
      return value.toPlainDate();
    } else if (value instanceof Temporal.PlainDateTime) {
      return value.toPlainDate();
    } else if (value instanceof Temporal.PlainDate) {
      return value;
    }
  } catch (error: unknown) {
    throw new FormConversionError(
      {
        message: 'useNormalizeFieldValuePlainDate - Failed to normalize value',
      },
      { cause: error },
    );
  }

  if (!(value === null || value === undefined)) {
    throw new FormTypeError({
      data: value,
      message: 'useNormalizeFieldValuePlainDate - Invalid type in context',
    });
  }

  return null;
}

export function useNormalizeFieldValuePlainDate() {
  const field = useFieldContext<FieldValuePlainDate>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo(() => normalizeFieldValuePlainDate(baseFieldValue), [baseFieldValue]);
}
