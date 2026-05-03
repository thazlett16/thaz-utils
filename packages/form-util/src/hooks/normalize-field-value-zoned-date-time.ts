import { useMemo } from 'react';

import { useStore } from '@tanstack/react-form';

import type * as v from 'valibot';

import { Temporal } from '@js-temporal/polyfill';

import type { _zonedDateTimeNullable } from '#src/schemas/zoned-date-time';

import { FormTypeError } from '#src/error';
import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValueZonedDateTime = v.InferInput<ReturnType<typeof _zonedDateTimeNullable>>;

export function normalizeFieldValueZonedDateTime(value: FieldValueZonedDateTime): Temporal.ZonedDateTime | null {
  if (value instanceof Temporal.ZonedDateTime) {
    return value;
  }

  if (!(value === null || value === undefined)) {
    throw new FormTypeError({
      data: value,
      message: 'useNormalizeFieldValueZonedDateTime - Invalid type in context',
    });
  }

  return null;
}

export function useNormalizeFieldValueZonedDateTime() {
  const field = useFieldContext<FieldValueZonedDateTime>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo(() => normalizeFieldValueZonedDateTime(baseFieldValue), [baseFieldValue]);
}
