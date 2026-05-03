import { useMemo } from 'react';

import { useStore } from '@tanstack/react-form';

import type { FieldValuePlainDateTime } from '@thazstack/form-util';
import { useFieldContext, FormConversionError, FormTypeError } from '@thazstack/form-util';

import {
  ZonedDateTime,
  parseZonedDateTime,
  toCalendarDateTime,
  CalendarDateTime,
  parseDateTime,
} from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';

export type FieldValueCalendarDateTime = FieldValuePlainDateTime | ZonedDateTime | CalendarDateTime;

export function normalizeFieldValueCalendarDateTime(value: FieldValueCalendarDateTime): CalendarDateTime | undefined {
  try {
    if (value instanceof Temporal.ZonedDateTime) {
      return toCalendarDateTime(parseZonedDateTime(value.toString()));
    } else if (value instanceof Temporal.PlainDateTime) {
      return parseDateTime(value.toString());
    } else if (value instanceof ZonedDateTime) {
      return toCalendarDateTime(value);
    } else if (value instanceof CalendarDateTime) {
      return value;
    }
  } catch (error: unknown) {
    throw new FormConversionError(
      {
        message: 'useNormalizeFieldValueCalendarDateTime - Failed to normalize value',
      },
      {
        cause: error,
      },
    );
  }

  if (!(value === null || value === undefined)) {
    throw new FormTypeError({
      data: value,
      message: 'useNormalizeFieldValueCalendarDateTime - Invalid type in context',
    });
  }

  return undefined;
}

export function useNormalizeFieldValueCalendarDateTime() {
  const field = useFieldContext<FieldValueCalendarDateTime>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<CalendarDateTime | undefined>(
    () => normalizeFieldValueCalendarDateTime(baseFieldValue),
    [baseFieldValue],
  );
}
