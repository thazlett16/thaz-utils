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

export function useNormalizeFieldValueCalendarDateTime() {
  const field = useFieldContext<FieldValueCalendarDateTime>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<CalendarDateTime | undefined>(() => {
    try {
      if (baseFieldValue instanceof Temporal.ZonedDateTime) {
        return toCalendarDateTime(parseZonedDateTime(baseFieldValue.toString()));
      } else if (baseFieldValue instanceof Temporal.PlainDateTime) {
        return parseDateTime(baseFieldValue.toString());
      } else if (baseFieldValue instanceof ZonedDateTime) {
        return toCalendarDateTime(baseFieldValue);
      } else if (baseFieldValue instanceof CalendarDateTime) {
        return baseFieldValue;
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

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      throw new FormTypeError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueCalendarDateTime - Invalid type in context',
      });
    }

    return undefined;
  }, [baseFieldValue]);
}
