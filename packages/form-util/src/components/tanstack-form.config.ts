import { createFormHook } from '@tanstack/react-form';

import { formContext, fieldContext } from '#src/tanstack-form.config';

import { FormShell } from './form-shell';

/**
 * Configured TanStack Form hook factory.
 *
 * Provides `useAppForm` and related utilities wired to the shared {@link formContext} and
 * {@link fieldContext}. Includes {@link FormShell} as a built-in form component.
 */
export const BaseForm = createFormHook({
  formContext,
  formComponents: {
    FormShell,
  },
  fieldContext,
  fieldComponents: {},
});
