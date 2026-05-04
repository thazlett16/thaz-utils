import { useMemo } from 'react';

import { useStore } from '@tanstack/react-form';

import { useFieldContext, FormConversionError, FormTypeError } from '@thazstack/form-util';
import type { TimeZoneOptions } from '@thazstack/temporal-util';

import { Temporal } from '@js-temporal/polyfill';
import type { Dayjs } from 'dayjs';

import { dayJS } from '#src/dayjs.config';

export type FieldValueZonedDateTime =
  | Temporal.ZonedDateTime
  | Temporal.Instant
  | Temporal.PlainDateTime
  | Temporal.PlainDate
  | Temporal.PlainTime
  | Dayjs
  | null
  | undefined;

export function normalizeFieldValueDayJS(value: FieldValueZonedDateTime, options: TimeZoneOptions): Dayjs | null {
  try {
    if (value instanceof Temporal.ZonedDateTime) {
      return dayJS.utc(value.toInstant().toString()).tz(options.timeZone);
    } else if (value instanceof Temporal.Instant) {
      return dayJS.utc(value.toString()).tz(options.timeZone);
    } else if (value instanceof Temporal.PlainDateTime) {
      return dayJS({
        years: value.year,
        months: value.month - 1,
        dates: value.day,
        hours: value.hour,
        minutes: value.minute,
        seconds: value.second,
        milliseconds: value.millisecond,
      }).tz(options.timeZone, true);
    } else if (value instanceof Temporal.PlainDate) {
      return dayJS({
        years: value.year,
        months: value.month - 1,
        dates: value.day,
      }).tz(options.timeZone, true);
    } else if (value instanceof Temporal.PlainTime) {
      return dayJS({
        hours: value.hour,
        minutes: value.minute,
        seconds: value.second,
        milliseconds: value.millisecond,
      }).tz(options.timeZone, true);
    } else if (dayJS.isDayjs(value)) {
      return value;
    }
  } catch (error: unknown) {
    throw new FormConversionError(
      {
        message: 'useNormalizeFieldValueDayJS - Failed to normalize value',
      },
      {
        cause: error,
      },
    );
  }

  if (!(value === null || value === undefined)) {
    throw new FormTypeError({
      data: value,
      message: 'useNormalizeFieldValueDayJS - Invalid type in context',
    });
  }

  return null;
}

export function useNormalizeFieldValueDayJS(options: TimeZoneOptions) {
  const field = useFieldContext<FieldValueZonedDateTime>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo(() => normalizeFieldValueDayJS(baseFieldValue, options), [baseFieldValue, options]);
}
