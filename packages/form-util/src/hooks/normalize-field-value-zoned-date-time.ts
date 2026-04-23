import { useMemo } from 'react';

import { useStore } from '@tanstack/react-form';

import type * as v from 'valibot';

import { Temporal } from '@js-temporal/polyfill';

import type { _zonedDateTimeNullable } from '#src/schemas/zoned-date-time/zoned-date-time';

import { FormTypeError } from '#src/error';
import { useFieldContext } from '#src/tanstack-form.config';

export type FieldValueZonedDateTime = v.InferInput<ReturnType<typeof _zonedDateTimeNullable>>;

export function useNormalizeFieldValueZonedDateTime() {
  const field = useFieldContext<FieldValueZonedDateTime>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<Temporal.ZonedDateTime | null>(() => {
    if (baseFieldValue instanceof Temporal.ZonedDateTime) {
      return baseFieldValue;
    }

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      throw new FormTypeError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueZonedDateTime - Invalid type in context',
      });
    }

    return null;
  }, [baseFieldValue]);
}
