import { useMemo } from 'react';

import { useStore } from '@tanstack/react-form';

import type * as v from 'valibot';

import { FormTypeError } from '#src/error';
import type { _numberNullable } from '#src/schemas/number';
import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValueNumber = v.InferInput<ReturnType<typeof _numberNullable>>;

export function normalizeFieldValueNumber(value: FieldValueNumber) {
  if (typeof value === 'number') {
    return value;
  }

  if (!(value === null || value === undefined)) {
    throw new FormTypeError({
      data: value,
      message: 'useNormalizeFieldValueNumber - Invalid type in context',
    });
  }

  return null;
}

export function useNormalizeFieldValueNumber() {
  const field = useFieldContext<FieldValueNumber>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo(() => normalizeFieldValueNumber(baseFieldValue), [baseFieldValue]);
}
