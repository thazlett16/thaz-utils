import { useStore } from '@tanstack/react-form';

import { Temporal } from '@js-temporal/polyfill';
import type * as v from 'valibot';

import { FormTypeError } from '#src/form-error';
import type { _plainDateNullable } from '#src/schemas/plain-date';
import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValuePlainDate = v.InferInput<ReturnType<typeof _plainDateNullable>>;

/**
 * Reads the current field value from context and normalizes it to `Temporal.PlainDate` | `null`.
 * Must be called within a field component via `form.AppField`.
 *
 * Accepts values of: `null` / `undefined` / `Temporal.ZonedDateTime` / `Temporal.PlainDateTime` / `Temporal.PlainDate`
 *
 * Throws {@link FormTypeError} for any other unexpected type.
 *
 * @returns The normalized `Temporal.PlainDate` | `null`.
 */
export function useNormalizeFieldValuePlainDate() {
  const field = useFieldContext<FieldValuePlainDate>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  if (baseFieldValue instanceof Temporal.ZonedDateTime) {
    return baseFieldValue.toPlainDate();
  } else if (baseFieldValue instanceof Temporal.PlainDateTime) {
    return baseFieldValue.toPlainDate();
  } else if (baseFieldValue instanceof Temporal.PlainDate) {
    return baseFieldValue;
  }

  if (!(baseFieldValue === null || baseFieldValue === undefined)) {
    throw new FormTypeError({
      data: baseFieldValue,
      message: 'useNormalizeFieldValuePlainDate - Invalid type in context',
    });
  }

  return null;
}
