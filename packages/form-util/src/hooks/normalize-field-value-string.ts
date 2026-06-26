import { useStore } from '@tanstack/react-form';

import type * as v from 'valibot';

import { FormTypeError } from '#src/form-error';
import type { _stringNullable } from '#src/schemas/string';
import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValueString = v.InferInput<ReturnType<typeof _stringNullable>>;

/**
 * Reads the current field value from context and normalizes it to `string`.
 * Must be called within a field component via `form.AppField`.
 *
 * Accepts values of: `null` / `undefined` / `string`
 *
 * Throws {@link FormTypeError} for any other unexpected type.
 *
 * @returns The normalized `string`.
 */
export function useNormalizeFieldValueString() {
  const field = useFieldContext<FieldValueString>();

  //  Disabled till @tanstack/react-form exports useSelector instead
  // oxlint-disable-next-line typescript/no-deprecated
  const baseFieldValue = useStore(field.store, (state) => state.value);

  if (typeof baseFieldValue === 'string') {
    return baseFieldValue;
  }

  if (!(baseFieldValue === null || baseFieldValue === undefined)) {
    throw new FormTypeError({
      data: baseFieldValue,
      message: 'useNormalizeFieldValueString - Invalid type in context',
    });
  }

  return '';
}
