import type { FieldValuePlainDate } from '@thazstack/form-util';
import type { ResolvedTimeZoneOptions } from '@thazstack/temporal-util';

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
import { useFieldContext, FormConversionError } from '@thazstack/form-util';
import { useMemo } from 'react';

export type FieldValueCalendarDate =
  | FieldValuePlainDate
  | Temporal.Instant
  | ZonedDateTime
  | CalendarDateTime
  | CalendarDate;

export function useNormalizeFieldValueCalendarDate(options: ResolvedTimeZoneOptions) {
  const field = useFieldContext<FieldValueCalendarDate>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<CalendarDate | undefined>(() => {
    try {
      if (baseFieldValue instanceof Temporal.ZonedDateTime) {
        return toCalendarDate(parseZonedDateTime(baseFieldValue.toString()));
      } else if (baseFieldValue instanceof Temporal.Instant) {
        return toCalendarDate(parseZonedDateTime(baseFieldValue.toZonedDateTimeISO(options.timeZone).toString()));
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
      console.error('useNormalizeFieldValueCalendarDate - Failed to normalize value', error);
      throw new FormConversionError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueCalendarDate - Failed to normalize value',
      });
    }

    if (typeof baseFieldValue === 'string') {
      throw new FormConversionError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueCalendarDate - Convert from string before passing into form',
      });
    }

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      console.error('useNormalizeFieldValueCalendarDate - Invalid type in context:', baseFieldValue);
      throw new Error('useNormalizeFieldValueCalendarDate - Invalid type in context');
    }

    return undefined;
  }, [baseFieldValue, options]);
}
