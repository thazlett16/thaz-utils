import type * as v from 'valibot';

import { useStore } from '@tanstack/react-form';
import { useMemo } from 'react';

import type { _numberNullable } from '#src/schemas/number/schema';

import { FormConversionError } from '#src/error';
import { useFieldContext } from '#src/tanstack-form.config';

type SchemaType = v.InferInput<ReturnType<typeof _numberNullable>>;

export type FieldValueNumber = Exclude<SchemaType, string>;

export function useNormalizeFieldValueNumber() {
  const field = useFieldContext<SchemaType>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<number | null>(() => {
    if (typeof baseFieldValue === 'number') {
      return baseFieldValue;
    }

    if (typeof baseFieldValue === 'string') {
      throw new FormConversionError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueNumber - Convert from string before passing into form',
      });
    }

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      throw new FormConversionError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueNumber - Invalid type in context',
      });
    }

    return null;
  }, [baseFieldValue]);
}
