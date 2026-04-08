import type { FieldValueString } from '@thazstack/form-util';

import { useStore } from '@tanstack/react-form';
import { useFieldContext } from '@thazstack/form-util';
import { useMemo } from 'react';

export type { FieldValueString } from '@thazstack/form-util';

export function useNormalizeFieldValueString() {
  const field = useFieldContext<FieldValueString>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<string | undefined>(() => {
    if (typeof baseFieldValue === 'string') {
      return baseFieldValue;
    }

    return undefined;
  }, [baseFieldValue]);
}
