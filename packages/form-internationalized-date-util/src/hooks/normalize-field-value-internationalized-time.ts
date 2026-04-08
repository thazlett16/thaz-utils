import type { FieldValuePlainTime } from '@thazstack/form-util';
import type { ResolvedTimeZoneOptions } from '@thazstack/temporal-util';

import { ZonedDateTime, parseZonedDateTime, toTime, Time, parseTime, CalendarDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { useStore } from '@tanstack/react-form';
import { useFieldContext, FormConversionError } from '@thazstack/form-util';
import { useMemo } from 'react';

export type FieldValueTime = FieldValuePlainTime | Temporal.Instant | ZonedDateTime | CalendarDateTime | Time;

export function useNormalizeFieldValueTime(options: ResolvedTimeZoneOptions) {
  const field = useFieldContext<FieldValueTime>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<Time | undefined>(() => {
    try {
      if (baseFieldValue instanceof Temporal.ZonedDateTime) {
        return toTime(parseZonedDateTime(baseFieldValue.toString()));
      } else if (baseFieldValue instanceof Temporal.Instant) {
        return toTime(parseZonedDateTime(baseFieldValue.toZonedDateTimeISO(options.timeZone).toString()));
      } else if (baseFieldValue instanceof Temporal.PlainDateTime) {
        return parseTime(baseFieldValue.toPlainTime().toString());
      } else if (baseFieldValue instanceof Temporal.PlainTime) {
        return parseTime(baseFieldValue.toString());
      } else if (baseFieldValue instanceof ZonedDateTime) {
        return toTime(baseFieldValue);
      } else if (baseFieldValue instanceof CalendarDateTime) {
        return toTime(baseFieldValue);
      } else if (baseFieldValue instanceof Time) {
        return baseFieldValue;
      }
    } catch (error: unknown) {
      console.error('useNormalizeFieldValueTime - Failed to normalize value', error);
      throw new FormConversionError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueTime - Failed to normalize value',
      });
    }

    if (typeof baseFieldValue === 'string') {
      throw new FormConversionError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueTime - Convert from string before passing into form',
      });
    }

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      throw new FormConversionError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueTime - Invalid type in context',
      });
    }

    return undefined;
  }, [baseFieldValue, options]);
}
