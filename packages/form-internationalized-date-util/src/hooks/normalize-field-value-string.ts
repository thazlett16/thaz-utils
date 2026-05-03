import { useMemo } from 'react';

import { useStore } from '@tanstack/react-form';

import type { FieldValueString } from '@thazstack/form-util';
import { useFieldContext } from '@thazstack/form-util';

export type { FieldValueString } from '@thazstack/form-util';

export function normalizeFieldValueString(value: FieldValueString): string | undefined {
  if (typeof value === 'string') {
    return value;
  }

  return undefined;
}

export function useNormalizeFieldValueString() {
  const field = useFieldContext<FieldValueString>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<string | undefined>(() => normalizeFieldValueString(baseFieldValue), [baseFieldValue]);
}
