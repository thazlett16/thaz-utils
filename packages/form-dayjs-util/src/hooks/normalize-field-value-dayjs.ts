import { useMemo } from 'react';

import { useStore } from '@tanstack/react-form';

import { useFieldContext, FormConversionError, FormTypeError } from '@thazstack/form-util';
import type { TimeZoneOptions } from '@thazstack/temporal-util';

import type { Dayjs } from 'dayjs';

import { Temporal } from '@js-temporal/polyfill';

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

export type NormalizeFieldValueDayJSOptions = Required<TimeZoneOptions>;

export function useNormalizeFieldValueDayJS(options: NormalizeFieldValueDayJSOptions) {
  const field = useFieldContext<FieldValueZonedDateTime>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<null | Dayjs>(() => {
    try {
      if (baseFieldValue instanceof Temporal.ZonedDateTime) {
        return dayJS.utc(baseFieldValue.toInstant().toString()).tz(options.timeZone);
      } else if (baseFieldValue instanceof Temporal.Instant) {
        return dayJS.utc(baseFieldValue.toString()).tz(options.timeZone);
      } else if (baseFieldValue instanceof Temporal.PlainDateTime) {
        return dayJS({
          years: baseFieldValue.year,
          months: baseFieldValue.month - 1,
          dates: baseFieldValue.day,
          hours: baseFieldValue.hour,
          minutes: baseFieldValue.minute,
          seconds: baseFieldValue.second,
          milliseconds: baseFieldValue.millisecond,
        }).tz(options.timeZone);
      } else if (baseFieldValue instanceof Temporal.PlainDate) {
        return dayJS({
          years: baseFieldValue.year,
          months: baseFieldValue.month - 1,
          dates: baseFieldValue.day,
        }).tz(options.timeZone);
      } else if (baseFieldValue instanceof Temporal.PlainTime) {
        return dayJS({
          hours: baseFieldValue.hour,
          minutes: baseFieldValue.minute,
          seconds: baseFieldValue.second,
          milliseconds: baseFieldValue.millisecond,
        }).tz(options.timeZone);
      } else if (dayJS.isDayjs(baseFieldValue)) {
        return baseFieldValue;
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

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      throw new FormTypeError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueDayJS - Invalid type in context',
      });
    }

    return null;
  }, [baseFieldValue, options]);
}
