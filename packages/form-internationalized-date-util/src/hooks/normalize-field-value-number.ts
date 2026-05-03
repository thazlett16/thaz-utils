import { useMemo } from 'react';

import { useStore } from '@tanstack/react-form';

import type { FieldValueNumber } from '@thazstack/form-util';
import { useFieldContext, FormTypeError } from '@thazstack/form-util';

export type { FieldValueNumber } from '@thazstack/form-util';

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

  return undefined;
}

export function useNormalizeFieldValueNumber() {
  const field = useFieldContext<FieldValueNumber>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo(() => normalizeFieldValueNumber(baseFieldValue), [baseFieldValue]);
}
