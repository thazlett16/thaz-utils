import type * as v from 'valibot';

import { useStore } from '@tanstack/react-form';
import { useMemo } from 'react';

import type { _stringNullable } from '#src/schemas/string/schema';

import { FormConversionError } from '#src/error';
import { useFieldContext } from '#src/tanstack-form.config';

type SchemaType = v.InferInput<ReturnType<typeof _stringNullable>>;

export type FieldValueString = SchemaType;

export function useNormalizeFieldValueString() {
  const field = useFieldContext<SchemaType>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<string | null>(() => {
    if (typeof baseFieldValue === 'string') {
      return baseFieldValue;
    }

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      throw new FormConversionError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueString - Invalid type in context',
      });
    }

    return null;
  }, [baseFieldValue]);
}
