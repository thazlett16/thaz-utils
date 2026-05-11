import { useStore } from '@tanstack/react-form';

import { Temporal } from '@js-temporal/polyfill';
import type * as v from 'valibot';

import { FormTypeError } from '#src/error';
import type { _plainTimeNullable } from '#src/schemas/plain-time';
import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValuePlainTime = v.InferInput<ReturnType<typeof _plainTimeNullable>>;

export function useNormalizeFieldValuePlainTime() {
  const field = useFieldContext<FieldValuePlainTime>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  if (baseFieldValue instanceof Temporal.ZonedDateTime) {
    return baseFieldValue.toPlainTime();
  } else if (baseFieldValue instanceof Temporal.PlainDateTime) {
    return baseFieldValue.toPlainTime();
  } else if (baseFieldValue instanceof Temporal.PlainTime) {
    return baseFieldValue;
  }

  if (!(baseFieldValue === null || baseFieldValue === undefined)) {
    throw new FormTypeError({
      data: baseFieldValue,
      message: 'useNormalizeFieldValuePlainTime - Invalid type in context',
    });
  }

  return null;
}
