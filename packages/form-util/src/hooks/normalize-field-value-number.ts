import { useStore } from '@tanstack/react-form';

import type * as v from 'valibot';

import { FormTypeError } from '#src/form-error';
import type { _numberNullable } from '#src/schemas/number';
import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValueNumber = v.InferInput<ReturnType<typeof _numberNullable>>;

/**
 * Reads the current field value from context and normalizes it to `number` | `null`.
 * Must be called within a field component via `form.AppField`.
 *
 * Accepts values of: `null` / `undefined` / `number`
 *
 * Throws {@link FormTypeError} for any other unexpected type.
 *
 * @returns The normalized `number` | `null`.
 */
export function useNormalizeFieldValueNumber() {
  const field = useFieldContext<FieldValueNumber>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  if (typeof baseFieldValue === 'number') {
    return baseFieldValue;
  }

  if (!(baseFieldValue === null || baseFieldValue === undefined)) {
    throw new FormTypeError({
      data: baseFieldValue,
      message: 'useNormalizeFieldValueNumber - Invalid type in context',
    });
  }

  return null;
}
