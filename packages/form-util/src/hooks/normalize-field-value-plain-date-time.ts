import { useStore } from '@tanstack/react-form';

import { Temporal } from '@js-temporal/polyfill';
import type * as v from 'valibot';

import { FormTypeError } from '#src/error';
import type { _plainDateTimeNullable } from '#src/schemas/plain-date-time';
import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValuePlainDateTime = v.InferInput<ReturnType<typeof _plainDateTimeNullable>>;

export function useNormalizeFieldValuePlainDateTime() {
  const field = useFieldContext<FieldValuePlainDateTime>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  if (baseFieldValue instanceof Temporal.ZonedDateTime) {
    return baseFieldValue.toPlainDateTime();
  } else if (baseFieldValue instanceof Temporal.PlainDateTime) {
    return baseFieldValue;
  }

  if (!(baseFieldValue === null || baseFieldValue === undefined)) {
    throw new FormTypeError({
      data: baseFieldValue,
      message: 'useNormalizeFieldValuePlainDateTime - Invalid type in context',
    });
  }

  return null;
}
