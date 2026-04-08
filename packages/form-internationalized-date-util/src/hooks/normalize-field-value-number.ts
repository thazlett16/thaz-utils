import type { FieldValueNumber } from '@thazstack/form-util';

import { useStore } from '@tanstack/react-form';
import { useFieldContext, FormTypeError } from '@thazstack/form-util';
import { useMemo } from 'react';

export type { FieldValueNumber } from '@thazstack/form-util';

export function useNormalizeFieldValueNumber() {
  const field = useFieldContext<FieldValueNumber>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<number | undefined>(() => {
    if (typeof baseFieldValue === 'number') {
      return baseFieldValue;
    }

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      throw new FormTypeError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueNumber - Invalid type in context',
      });
    }

    return undefined;
  }, [baseFieldValue]);
}
