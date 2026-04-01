import type { ResolvedTimeZoneOptions } from '@thazstack/temporal-util';

import { ZonedDateTime, parseZonedDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { useStore } from '@tanstack/react-form';
import { useFieldContext } from '@thazstack/form-util';
import { useMemo } from 'react';

export type FieldValueZonedDateTime = Temporal.ZonedDateTime | Temporal.Instant | ZonedDateTime | null | undefined;

export function useNormalizeFieldValueZonedDateTime(options: ResolvedTimeZoneOptions) {
  const field = useFieldContext<FieldValueZonedDateTime>();

  const baseFieldValue = useStore(field.store, (state) => state.value);

  return useMemo<ZonedDateTime | undefined>(() => {
    try {
      if (baseFieldValue instanceof Temporal.ZonedDateTime) {
        return parseZonedDateTime(baseFieldValue.toString());
      } else if (baseFieldValue instanceof Temporal.Instant) {
        return parseZonedDateTime(baseFieldValue.toZonedDateTimeISO(options.timeZone).toString());
      } else if (baseFieldValue instanceof ZonedDateTime) {
        return baseFieldValue;
      }
    } catch (error: unknown) {
      console.error('useNormalizeFieldValueZonedDateTime - Failed to normalize value', error);
      throw new Error('useNormalizeFieldValueZonedDateTime - Failed to normalize value', { cause: error });
    }

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      console.error('useNormalizeFieldValueZonedDateTime - Invalid type in context:', baseFieldValue);
      throw new Error('useNormalizeFieldValueZonedDateTime - Invalid type in context');
    }

    return undefined;
  }, [baseFieldValue, options]);
}
