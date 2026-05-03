import { useMemo } from 'react';

import { useStore } from '@tanstack/react-form';

import type * as v from 'valibot';

import type { _stringNullable } from '#src/schemas/string';

import { FormTypeError } from '#src/error';
import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValueString = v.InferInput<ReturnType<typeof _stringNullable>>;

export function normalizeFieldValueString(value: FieldValueString): string | null {
  if (typeof value === 'string') {
    return value;
  }

  if (!(value === null || value === undefined)) {
    throw new FormTypeError({
      data: value,
      message: 'useNormalizeFieldValueString - Invalid type in context',
    });
  }

  return null;
}

export function useNormalizeFieldValueString() {
  const field = useFieldContext<FieldValueString>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo(() => normalizeFieldValueString(baseFieldValue), [baseFieldValue]);
}
