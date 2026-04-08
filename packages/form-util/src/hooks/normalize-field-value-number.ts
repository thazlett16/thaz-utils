import type * as v from 'valibot';

import { useStore } from '@tanstack/react-form';
import { useMemo } from 'react';

import type { _numberNullable } from '#src/schemas/number/schema';

import { FormTypeError } from '#src/error';
import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValueNumber = v.InferInput<ReturnType<typeof _numberNullable>>;

export function useNormalizeFieldValueNumber() {
  const field = useFieldContext<FieldValueNumber>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<number | null>(() => {
    if (typeof baseFieldValue === 'number') {
      return baseFieldValue;
    }

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      throw new FormTypeError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueNumber - Invalid type in context',
      });
    }

    return null;
  }, [baseFieldValue]);
}
