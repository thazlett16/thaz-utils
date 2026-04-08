import type { FieldValueInstant } from '@thazstack/form-util';
import type { ResolvedTimeZoneOptions } from '@thazstack/temporal-util';

import { ZonedDateTime, parseZonedDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { useStore } from '@tanstack/react-form';
import { useFieldContext, FormConversionError } from '@thazstack/form-util';
import { useMemo } from 'react';

export type FieldValueZonedDateTime = FieldValueInstant | ZonedDateTime | null | undefined;

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
      throw new FormConversionError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueZonedDateTime - Failed to normalize value',
      });
    }

    if (typeof baseFieldValue === 'string') {
      throw new FormConversionError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueZonedDateTime - Convert from string before passing into form',
      });
    }

    if (!(baseFieldValue === null || baseFieldValue === undefined)) {
      throw new FormConversionError({
        data: baseFieldValue,
        message: 'useNormalizeFieldValueZonedDateTime - Invalid type in context',
      });
    }

    return undefined;
  }, [baseFieldValue, options]);
}
