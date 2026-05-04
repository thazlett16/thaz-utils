import { useMemo } from 'react';

import { useStore } from '@tanstack/react-form';

import { Temporal } from '@js-temporal/polyfill';
import type * as v from 'valibot';

import { FormConversionError, FormTypeError } from '#src/error';
import type { _instantNullable } from '#src/schemas/instant';
import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValueInstant = v.InferInput<ReturnType<typeof _instantNullable>>;

export function normalizeFieldValueInstant(value: FieldValueInstant): Temporal.Instant | null {
  try {
    if (value instanceof Temporal.ZonedDateTime) {
      return value.toInstant();
    } else if (value instanceof Temporal.Instant) {
      return value;
    }
  } catch (error: unknown) {
    throw new FormConversionError(
      {
        message: 'useNormalizeFieldValueInstant - Failed to normalize value',
      },
      { cause: error },
    );
  }

  if (!(value === null || value === undefined)) {
    throw new FormTypeError({
      data: value,
      message: 'useNormalizeFieldValueInstant - Invalid type in context',
    });
  }

  return null;
}

export function useNormalizeFieldValueInstant() {
  const field = useFieldContext<FieldValueInstant>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo(() => normalizeFieldValueInstant(baseFieldValue), [baseFieldValue]);
}
