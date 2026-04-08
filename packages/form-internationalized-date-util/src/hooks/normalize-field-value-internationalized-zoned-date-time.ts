import type { FieldValueZonedDateTime as BaseFieldValueZonedDateTime } from '@thazstack/form-util';

import { ZonedDateTime, parseZonedDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { useStore } from '@tanstack/react-form';
import { useFieldContext, FormConversionError, FormTypeError } from '@thazstack/form-util';
import { useMemo } from 'react';

export type FieldValueZonedDateTime = BaseFieldValueZonedDateTime | ZonedDateTime | null | undefined;

export function useNormalizeFieldValueZonedDateTime() {
  const field = useFieldContext<FieldValueZonedDateTime>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<ZonedDateTime | undefined>(() => {
    try {
      if (baseFieldValue instanceof Temporal.ZonedDateTime) {
        return parseZonedDateTime(baseFieldValue.toString());
      } else if (baseFieldValue instanceof ZonedDateTime) {
        return baseFieldValue;
      }
    } catch (error: unknown) {
      throw new FormConversionError(
        {
          message: 'useNormalizeFieldValueZonedDateTime - Failed to normalize value',
        },
        {
          cause: error,
        },
      );
    }

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      throw new FormTypeError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueZonedDateTime - Invalid type in context',
      });
    }

    return undefined;
  }, [baseFieldValue]);
}
