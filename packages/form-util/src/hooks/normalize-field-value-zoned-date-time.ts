import { useStore } from '@tanstack/react-form';

import { Temporal } from '@js-temporal/polyfill';
import type * as v from 'valibot';

import { FormTypeError } from '#src/error';
import type { _zonedDateTimeNullable } from '#src/schemas/zoned-date-time';
import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValueZonedDateTime = v.InferInput<ReturnType<typeof _zonedDateTimeNullable>>;

/**
 * Reads the current field value from context and normalizes it to `Temporal.ZonedDateTime` | `null`.
 * Must be called within a field component via `form.AppField`.
 *
 * Accepts values of: `null` / `undefined` / `Temporal.ZonedDateTime`
 *
 * Throws {@link FormTypeError} for any other unexpected type.
 *
 * @returns The normalized `Temporal.ZonedDateTime` | `null`.
 */
export function useNormalizeFieldValueZonedDateTime() {
  const field = useFieldContext<FieldValueZonedDateTime>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  if (baseFieldValue instanceof Temporal.ZonedDateTime) {
    return baseFieldValue;
  }

  if (!(baseFieldValue === null || baseFieldValue === undefined)) {
    throw new FormTypeError({
      data: baseFieldValue,
      message: 'useNormalizeFieldValueZonedDateTime - Invalid type in context',
    });
  }

  return null;
}
