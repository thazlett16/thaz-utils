import type * as v from 'valibot';

import { useStore } from '@tanstack/react-form';
import { useMemo } from 'react';

import type { _numberNullable } from '#src/schemas/number/schema';

import { FormConversionError, FormTypeError } from '#src/error';
import { useFieldContext } from '#src/tanstack-form.config';

type FieldValueNumberSchemaType = v.InferInput<ReturnType<typeof _numberNullable>>;

export type FieldValueNumber = Exclude<FieldValueNumberSchemaType, string>;

export function useNormalizeFieldValueNumber() {
  const field = useFieldContext<FieldValueNumberSchemaType>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<number | null>(() => {
    if (typeof baseFieldValue === 'number') {
      return baseFieldValue;
    } else if (typeof baseFieldValue === 'string') {
      if (baseFieldValue.trim() === '') {
        return null;
      }

      try {
        return Number(baseFieldValue);
      } catch (error: unknown) {
        throw new FormConversionError(
          {
            message: 'useNormalizeFieldValueNumber - Failed to normalize value',
          },
          { cause: error },
        );
      }
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
