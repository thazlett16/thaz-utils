import { useStore } from '@tanstack/react-form';

import { Temporal } from '@js-temporal/polyfill';
import type * as v from 'valibot';

import { FormTypeError } from '#src/error';
import type { _instantNullable } from '#src/schemas/instant';
import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValueInstant = v.InferInput<ReturnType<typeof _instantNullable>>;

export function useNormalizeFieldValueInstant() {
  const field = useFieldContext<FieldValueInstant>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  if (baseFieldValue instanceof Temporal.ZonedDateTime) {
    return baseFieldValue.toInstant();
  } else if (baseFieldValue instanceof Temporal.Instant) {
    return baseFieldValue;
  }

  if (!(baseFieldValue === null || baseFieldValue === undefined)) {
    throw new FormTypeError({
      data: baseFieldValue,
      message: 'useNormalizeFieldValueInstant - Invalid type in context',
    });
  }

  return null;
}
