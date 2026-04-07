import type { FieldValuePlainDateTime } from '@thazstack/form-util';
import type { ResolvedTimeZoneOptions } from '@thazstack/temporal-util';

import {
  ZonedDateTime,
  parseZonedDateTime,
  toCalendarDateTime,
  CalendarDateTime,
  parseDateTime,
} from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { useStore } from '@tanstack/react-form';
import { useFieldContext, FormConversionError } from '@thazstack/form-util';
import { useMemo } from 'react';

export type FieldValueCalendarDateTime = FieldValuePlainDateTime | Temporal.Instant | ZonedDateTime | CalendarDateTime;

export function useNormalizeFieldValueCalendarDateTime(options: ResolvedTimeZoneOptions) {
  const field = useFieldContext<FieldValueCalendarDateTime>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<CalendarDateTime | undefined>(() => {
    try {
      if (baseFieldValue instanceof Temporal.ZonedDateTime) {
        return toCalendarDateTime(parseZonedDateTime(baseFieldValue.toString()));
      } else if (baseFieldValue instanceof Temporal.Instant) {
        return toCalendarDateTime(parseZonedDateTime(baseFieldValue.toZonedDateTimeISO(options.timeZone).toString()));
      } else if (baseFieldValue instanceof Temporal.PlainDateTime) {
        return parseDateTime(baseFieldValue.toString());
      } else if (baseFieldValue instanceof ZonedDateTime) {
        return toCalendarDateTime(baseFieldValue);
      } else if (baseFieldValue instanceof CalendarDateTime) {
        return baseFieldValue;
      }
    } catch (error: unknown) {
      console.error('useNormalizeFieldValueCalendarDateTime - Failed to normalize value', error);
      throw new FormConversionError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueCalendarDateTime - Failed to normalize value',
      });
    }

    if (typeof baseFieldValue === 'string') {
      throw new FormConversionError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueCalendarDateTime - Convert from string before passing into form',
      });
    }

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      throw new FormConversionError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueCalendarDateTime - Invalid type in context',
      });
    }

    return undefined;
  }, [baseFieldValue, options]);
}
