import { useMemo } from 'react';

import { useStore } from '@tanstack/react-form';

import type { FieldValueZonedDateTime as BaseFieldValueZonedDateTime } from '@thazstack/form-util';
import { useFieldContext, FormConversionError, FormTypeError } from '@thazstack/form-util';

import { ZonedDateTime, parseZonedDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';

export type FieldValueZonedDateTime = BaseFieldValueZonedDateTime | ZonedDateTime | null | undefined;

export function normalizeFieldValueZonedDateTime(value: FieldValueZonedDateTime): ZonedDateTime | undefined {
  try {
    if (value instanceof Temporal.ZonedDateTime) {
      return parseZonedDateTime(value.toString());
    } else if (value instanceof ZonedDateTime) {
      return value;
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

  if (!(value === null || value === undefined)) {
    throw new FormTypeError({
      data: value,
      message: 'useNormalizeFieldValueZonedDateTime - Invalid type in context',
    });
  }

  return undefined;
}

export function useNormalizeFieldValueZonedDateTime() {
  const field = useFieldContext<FieldValueZonedDateTime>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<ZonedDateTime | undefined>(
    () => normalizeFieldValueZonedDateTime(baseFieldValue),
    [baseFieldValue],
  );
}
