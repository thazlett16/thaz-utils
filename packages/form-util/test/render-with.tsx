import type { FormOptions } from '@tanstack/react-form';
import { useForm } from '@tanstack/react-form';
import { createMemoryHistory, createRootRoute, createRouter, RouterContextProvider } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { Component } from 'react';

import { fieldContext, formContext } from '#src/tanstack-form.config';

export function createTestRouter() {
  const rootRoute = createRootRoute();
  return createRouter({ routeTree: rootRoute, history: createMemoryHistory() });
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div data-testid="error-boundary">
          <span data-testid="error-name">{this.state.error.constructor.name}</span>
          <span data-testid="error-message">{this.state.error.message}</span>
        </div>
      );
    }

    return this.props.children;
  }
}

interface FieldWrapperProps {
  initialValue?: unknown;
  children: ReactNode;
}

export function FieldWrapper({ initialValue, children }: FieldWrapperProps) {
  // oxlint-disable-next-line typescript/no-explicit-any
  const form = useForm<any>({ defaultValues: { field: initialValue } });

  return (
    // oxlint-disable-next-line typescript/no-explicit-any
    <formContext.Provider value={form as any}>
      {/* oxlint-disable-next-line typescript/no-explicit-any */}
      <form.Field name={'field' as any}>
        {/* oxlint-disable-next-line typescript/no-explicit-any */}
        {(field: any) => (
          <fieldContext.Provider value={field}>{children}</fieldContext.Provider>
        )}
      </form.Field>
    </formContext.Provider>
  );
}

interface FormWrapperProps {
  children: ReactNode;
  // oxlint-disable-next-line typescript/no-explicit-any
  formOptions?: FormOptions<any>;
  router?: ReturnType<typeof createTestRouter>;
}

export function FormWrapper({ children, formOptions, router }: FormWrapperProps) {
  // oxlint-disable-next-line typescript/no-explicit-any
  const form = useForm((formOptions ?? { defaultValues: {} }) as FormOptions<any>);
  // oxlint-disable-next-line typescript/no-explicit-any
  const inner = <formContext.Provider value={form as any}>{children}</formContext.Provider>;

  if (router) {
    return <RouterContextProvider router={router}>{inner}</RouterContextProvider>;
  }

  return inner;
}
