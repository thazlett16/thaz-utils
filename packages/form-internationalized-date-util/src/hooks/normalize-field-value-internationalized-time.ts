import { useMemo } from 'react';

import { useStore } from '@tanstack/react-form';

import type { FieldValuePlainTime } from '@thazstack/form-util';
import { useFieldContext, FormConversionError, FormTypeError } from '@thazstack/form-util';

import { ZonedDateTime, parseZonedDateTime, toTime, Time, parseTime, CalendarDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';

export type FieldValueTime = FieldValuePlainTime | ZonedDateTime | CalendarDateTime | Time;

export function useNormalizeFieldValueTime() {
  const field = useFieldContext<FieldValueTime>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<Time | undefined>(() => {
    try {
      if (baseFieldValue instanceof Temporal.ZonedDateTime) {
        return toTime(parseZonedDateTime(baseFieldValue.toString()));
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
      throw new FormConversionError(
        {
          message: 'useNormalizeFieldValueTime - Failed to normalize value',
        },
        {
          cause: error,
        },
      );
    }

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      throw new FormTypeError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueTime - Invalid type in context',
      });
    }

    return undefined;
  }, [baseFieldValue]);
}
