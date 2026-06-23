import { useStore } from '@tanstack/react-form';

import type { FieldValueZonedDateTime as BaseFieldValueZonedDateTime } from '@thazstack/form-util';
import { useFieldContext, FormConversionError, FormTypeError } from '@thazstack/form-util';

import { ZonedDateTime, parseZonedDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';

export type FieldValueZonedDateTime = BaseFieldValueZonedDateTime | ZonedDateTime | null | undefined;

export function useNormalizeFieldValueZonedDateTime() {
  const field = useFieldContext<FieldValueZonedDateTime>();

  //  Disabled till @tanstack/react-form exports useSelector instead
  // oxlint-disable-next-line typescript/no-deprecated
  const baseFieldValue = useStore(field.store, (state) => state.value);

  try {
    if (baseFieldValue instanceof Temporal.ZonedDateTime) {
      return parseZonedDateTime(baseFieldValue.toString());
    } else if (baseFieldValue instanceof ZonedDateTime) {
      return baseFieldValue;
    }
  } catch (error: unknown) {
    throw new FormConversionError(
      {
        message: 'useNormalizeFieldValueZonedDateTime - Failed to normalize baseFieldValue',
      },
      {
        cause: error,
      },
    );
  }

  if (!(baseFieldValue === null || baseFieldValue === undefined)) {
    throw new FormTypeError({
      data: baseFieldValue,
      message: 'useNormalizeFieldValueZonedDateTime - Invalid type in context',
    });
  }

  return undefined;
}
