import { useMemo } from 'react';

import { useStore } from '@tanstack/react-form';

import type * as v from 'valibot';

import { Temporal } from '@js-temporal/polyfill';

import type { _instantNullable } from '#src/schemas/instant';

import { FormConversionError, FormTypeError } from '#src/error';
import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValueInstant = v.InferInput<ReturnType<typeof _instantNullable>>;

export function useNormalizeFieldValueInstant() {
  const field = useFieldContext<FieldValueInstant>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<Temporal.Instant | null>(() => {
    try {
      if (baseFieldValue instanceof Temporal.ZonedDateTime) {
        return baseFieldValue.toInstant();
      } else if (baseFieldValue instanceof Temporal.Instant) {
        return baseFieldValue;
      }
    } catch (error: unknown) {
      throw new FormConversionError(
        {
          message: 'useNormalizeFieldValueInstant - Failed to normalize value',
        },
        { cause: error },
      );
    }

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      throw new FormTypeError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueInstant - Invalid type in context',
      });
    }

    return null;
  }, [baseFieldValue]);
}
