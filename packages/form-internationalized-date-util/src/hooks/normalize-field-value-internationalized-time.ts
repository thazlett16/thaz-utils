import { useMemo } from 'react';

import { useStore } from '@tanstack/react-form';

import type { FieldValuePlainTime } from '@thazstack/form-util';
import { useFieldContext, FormConversionError, FormTypeError } from '@thazstack/form-util';

import { ZonedDateTime, parseZonedDateTime, toTime, Time, parseTime, CalendarDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';

export type FieldValueTime = FieldValuePlainTime | ZonedDateTime | CalendarDateTime | Time;

export function normalizeFieldValueTime(value: FieldValueTime): Time | undefined {
  try {
    if (value instanceof Temporal.ZonedDateTime) {
      return toTime(parseZonedDateTime(value.toString()));
    } else if (value instanceof Temporal.PlainDateTime) {
      return parseTime(value.toPlainTime().toString());
    } else if (value instanceof Temporal.PlainTime) {
      return parseTime(value.toString());
    } else if (value instanceof ZonedDateTime) {
      return toTime(value);
    } else if (value instanceof CalendarDateTime) {
      return toTime(value);
    } else if (value instanceof Time) {
      return value;
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

  if (!(value === null || value === undefined)) {
    throw new FormTypeError({
      data: value,
      message: 'useNormalizeFieldValueTime - Invalid type in context',
    });
  }

  return undefined;
}

export function useNormalizeFieldValueTime() {
  const field = useFieldContext<FieldValueTime>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<Time | undefined>(() => normalizeFieldValueTime(baseFieldValue), [baseFieldValue]);
}
