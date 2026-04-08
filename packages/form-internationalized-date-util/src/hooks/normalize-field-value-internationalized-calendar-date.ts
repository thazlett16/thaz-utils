import type { FieldValuePlainDate } from '@thazstack/form-util';

import {
  ZonedDateTime,
  parseZonedDateTime,
  toCalendarDate,
  CalendarDate,
  CalendarDateTime,
  parseDate,
} from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { useStore } from '@tanstack/react-form';
import { useFieldContext, FormConversionError, FormTypeError } from '@thazstack/form-util';
import { useMemo } from 'react';

export type FieldValueCalendarDate = FieldValuePlainDate | ZonedDateTime | CalendarDateTime | CalendarDate;

export function useNormalizeFieldValueCalendarDate() {
  const field = useFieldContext<FieldValueCalendarDate>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<CalendarDate | undefined>(() => {
    try {
      if (baseFieldValue instanceof Temporal.ZonedDateTime) {
        return toCalendarDate(parseZonedDateTime(baseFieldValue.toString()));
      } else if (baseFieldValue instanceof Temporal.PlainDateTime) {
        return parseDate(baseFieldValue.toPlainDate().toString());
      } else if (baseFieldValue instanceof Temporal.PlainDate) {
        return parseDate(baseFieldValue.toString());
      } else if (baseFieldValue instanceof ZonedDateTime) {
        return toCalendarDate(baseFieldValue);
      } else if (baseFieldValue instanceof CalendarDateTime) {
        return toCalendarDate(baseFieldValue);
      } else if (baseFieldValue instanceof CalendarDate) {
        return baseFieldValue;
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

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      throw new FormTypeError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueCalendarDate - Invalid type in context',
      });
    }

    return undefined;
  }, [baseFieldValue]);
}
