import { useStore } from '@tanstack/react-form';

import type { FieldValueNumber } from '@thazstack/form-util';
import { useFieldContext, FormTypeError } from '@thazstack/form-util';

export type { FieldValueNumber } from '@thazstack/form-util';

export function useNormalizeFieldValueNumber() {
  const field = useFieldContext<FieldValueNumber>();

  //  Disabled till @tanstack/react-form exports useSelector instead
  // oxlint-disable-next-line typescript/no-deprecated
  const baseFieldValue = useStore(field.store, (state) => state.value);

  if (typeof baseFieldValue === 'number') {
    return baseFieldValue;
  }

  if (!(baseFieldValue === null || baseFieldValue === undefined)) {
    throw new FormTypeError({
      data: baseFieldValue,
      message: 'useNormalizeFieldValueNumber - Invalid type in context',
    });
  }

  return undefined;
}
