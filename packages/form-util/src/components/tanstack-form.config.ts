import { createFormHook } from '@tanstack/react-form';

import { formContext, fieldContext } from '#src/tanstack-form.config';

import { FormShell } from './form-shell';

export const BaseForm = createFormHook({
  formContext,
  formComponents: {
    FormShell,
  },
  fieldContext,
  fieldComponents: {},
});
