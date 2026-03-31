import { useStore } from '@tanstack/react-form';
import { useMemo } from 'react';

import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValueNumber = number | null | undefined;

export function useNormalizeFieldValueNumber() {
  const field = useFieldContext<FieldValueNumber>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo(() => {
    if (typeof baseFieldValue === 'number') {
      return baseFieldValue;
    }

    return null;
  }, [baseFieldValue]);
}
