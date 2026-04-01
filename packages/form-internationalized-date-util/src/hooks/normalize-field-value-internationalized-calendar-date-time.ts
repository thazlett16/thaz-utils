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
import { useFieldContext } from '@thazstack/form-util';
import { useMemo } from 'react';

export type FieldValueCalendarDateTime =
  | Temporal.ZonedDateTime
  | Temporal.Instant
  | Temporal.PlainDateTime
  | ZonedDateTime
  | CalendarDateTime
  | null
  | undefined;

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
      throw new Error('useNormalizeFieldValueCalendarDateTime - Failed to normalize value', { cause: error });
    }

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      console.error('useNormalizeFieldValueCalendarDateTime - Invalid type in context:', baseFieldValue);
      throw new Error('useNormalizeFieldValueCalendarDateTime - Invalid type in context');
    }

    return undefined;
  }, [baseFieldValue, options]);
}
