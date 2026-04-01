import type { FieldValueNumber } from '@thazstack/form-util';

import { useStore } from '@tanstack/react-form';
import { useFieldContext } from '@thazstack/form-util';
import { useMemo } from 'react';

export function useNormalizeFieldValueNumber() {
  const field = useFieldContext<FieldValueNumber>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<number | undefined>(() => {
    if (typeof baseFieldValue === 'number') {
      return baseFieldValue;
    }

    return undefined;
  }, [baseFieldValue]);
}
