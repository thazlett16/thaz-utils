import { useStore } from '@tanstack/react-form';
import { useMemo } from 'react';

import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValueString = string | number | null | undefined;

export function useNormalizeFieldValueString() {
  const field = useFieldContext<FieldValueString>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo(() => {
    if (typeof baseFieldValue === 'string') {
      return baseFieldValue;
    } else if (typeof baseFieldValue === 'number') {
      return baseFieldValue.toString();
    }

    return null;
  }, [baseFieldValue]);
}
