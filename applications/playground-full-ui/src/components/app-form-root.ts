import { createFormHook } from '@tanstack/react-form';
import { fieldContext, formContext } from '@thazstack/form-internationalized-date-util';

export const { useAppForm, withForm, withFieldGroup, useTypedAppFormContext } = createFormHook({
  fieldComponents: {},
  formComponents: {},
  fieldContext,
  formContext,
});
