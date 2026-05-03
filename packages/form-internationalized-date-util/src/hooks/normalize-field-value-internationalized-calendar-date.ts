import { useMemo } from 'react';

import { useStore } from '@tanstack/react-form';

import type { FieldValuePlainDate } from '@thazstack/form-util';
import { useFieldContext, FormConversionError, FormTypeError } from '@thazstack/form-util';

import {
  ZonedDateTime,
  parseZonedDateTime,
  toCalendarDate,
  CalendarDate,
  CalendarDateTime,
  parseDate,
} from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';

export type FieldValueCalendarDate = FieldValuePlainDate | ZonedDateTime | CalendarDateTime | CalendarDate;

export function normalizeFieldValueCalendarDate(value: FieldValueCalendarDate): CalendarDate | undefined {
  try {
    if (value instanceof Temporal.ZonedDateTime) {
      return toCalendarDate(parseZonedDateTime(value.toString()));
    } else if (value instanceof Temporal.PlainDateTime) {
      return parseDate(value.toPlainDate().toString());
    } else if (value instanceof Temporal.PlainDate) {
      return parseDate(value.toString());
    } else if (value instanceof ZonedDateTime) {
      return toCalendarDate(value);
    } else if (value instanceof CalendarDateTime) {
      return toCalendarDate(value);
    } else if (value instanceof CalendarDate) {
      return value;
    }
  } catch (error: unknown) {
    throw new FormConversionError(
      {
        message: 'useNormalizeFieldValueCalendarDate - Failed to normalize value',
      },
      {
        cause: error,
      },
    );
  }

  if (!(value === null || value === undefined)) {
    throw new FormTypeError({
      data: value,
      message: 'useNormalizeFieldValueCalendarDate - Invalid type in context',
    });
  }

  return undefined;
}

export function useNormalizeFieldValueCalendarDate() {
  const field = useFieldContext<FieldValueCalendarDate>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<CalendarDate | undefined>(() => normalizeFieldValueCalendarDate(baseFieldValue), [baseFieldValue]);
}
