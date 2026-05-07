import { createFormHook } from '@tanstack/react-form';

import { formContext, fieldContext } from '@thazstack/form-internationalized-date-util';

export const { useAppForm, withForm, withFieldGroup, useTypedAppFormContext } = createFormHook({
  formContext,
  formComponents: {},
  fieldContext,
  fieldComponents: {},
});
