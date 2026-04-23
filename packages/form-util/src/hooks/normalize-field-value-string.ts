import { useMemo } from 'react';

import { useStore } from '@tanstack/react-form';

import type * as v from 'valibot';

import type { _stringNullable } from '#src/schemas/string';

import { FormTypeError } from '#src/error';
import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValueString = v.InferInput<ReturnType<typeof _stringNullable>>;

export function useNormalizeFieldValueString() {
  const field = useFieldContext<FieldValueString>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<string | null>(() => {
    if (typeof baseFieldValue === 'string') {
      return baseFieldValue;
    }

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      throw new FormTypeError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueString - Invalid type in context',
      });
    }

    return null;
  }, [baseFieldValue]);
}
