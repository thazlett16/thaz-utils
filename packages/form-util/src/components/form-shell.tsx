import type { ComponentProps } from 'react';
import { useCallback } from 'react';

import { useFormContext } from '#src/tanstack-form.config';

export type FormShellProps = ComponentProps<'form'>;

/**
 * A `<form>` wrapper that wires up TanStack Form's submit and reset handlers.
 *
 * Prevents the default browser submit/reset behaviour, calls `formContext.handleSubmit()` on
 * submit and `formContext.reset()` on reset, and sets `autoComplete="off"` by default.
 * Any prop can be overridden by passing it directly.
 *
 * @param props - {@link FormShellProps}
 */
export function FormShell(props: Readonly<FormShellProps>) {
  const { children, onSubmit, onReset, autoComplete, ...rest } = props;

  const formContext = useFormContext();

  const defaultOnSubmit = useCallback<NonNullable<ComponentProps<'form'>['onSubmit']>>(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      void formContext.handleSubmit();
    },
    [formContext],
  );

  const defaultOnReset = useCallback<NonNullable<ComponentProps<'form'>['onReset']>>(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      formContext.reset();
    },
    [formContext],
  );

  return (
    <form
      {...rest}
      autoComplete={autoComplete ?? 'off'}
      onSubmit={onSubmit ?? defaultOnSubmit}
      onReset={onReset ?? defaultOnReset}
    >
      {children}
    </form>
  );
}
