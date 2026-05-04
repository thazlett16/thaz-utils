import { useMemo } from 'react';

import { useStore } from '@tanstack/react-form';

import { Temporal } from '@js-temporal/polyfill';
import type * as v from 'valibot';

import { FormConversionError, FormTypeError } from '#src/error';
import type { _plainTimeNullable } from '#src/schemas/plain-time';
import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValuePlainTime = v.InferInput<ReturnType<typeof _plainTimeNullable>>;

export function normalizeFieldValuePlainTime(value: FieldValuePlainTime): Temporal.PlainTime | null {
  try {
    if (value instanceof Temporal.ZonedDateTime) {
      return value.toPlainTime();
    } else if (value instanceof Temporal.PlainDateTime) {
      return value.toPlainTime();
    } else if (value instanceof Temporal.PlainTime) {
      return value;
    }
  } catch (error: unknown) {
    throw new FormConversionError(
      {
        message: 'useNormalizeFieldValuePlainTime - Failed to normalize value',
      },
      { cause: error },
    );
  }

  if (!(value === null || value === undefined)) {
    throw new FormTypeError({
      data: value,
      message: 'useNormalizeFieldValuePlainTime - Invalid type in context',
    });
  }

  return null;
}

export function useNormalizeFieldValuePlainTime() {
  const field = useFieldContext<FieldValuePlainTime>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo(() => normalizeFieldValuePlainTime(baseFieldValue), [baseFieldValue]);
}
