import { render } from 'vitest-browser-react';

import { useForm } from '@tanstack/react-form';

import { describe, expect, test } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';

import { useFieldErrorMessageList } from '#src/hooks/field-error-message';
import { fieldContext, formContext } from '#src/tanstack-form.config';

function FieldErrorDisplay() {
  const errorMessage = useFieldErrorMessageList();
  return <div data-testid="error">{errorMessage ?? 'no error'}</div>;
}

function TestFieldError() {
  const form = useForm({
    defaultValues: { field: '' },
    onSubmit: async () => {
      /* noop */
    },
  });

  return (
    // oxlint-disable-next-line typescript/no-explicit-any
    <formContext.Provider value={form as any}>
      <form.Field
        // oxlint-disable-next-line typescript/no-explicit-any
        name={'field' as any}
        validators={{
          onChange: ({ value }: { value: string }) => (value.length > 0 && value.length < 3 ? 'too short' : undefined),
        }}
      >
        {/* oxlint-disable-next-line typescript/no-explicit-any */}
        {(field: any) => (
          <fieldContext.Provider value={field}>
            <FieldErrorDisplay />
            <input
              data-testid="field-input"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={() => field.handleBlur()}
            />
          </fieldContext.Provider>
        )}
      </form.Field>
      <button
        data-testid="submit-btn"
        onClick={() => void form.handleSubmit()}
      >
        Submit
      </button>
    </formContext.Provider>
  );
}

describe('useFieldErrorMessageList', () => {
  test('returns null before blur or submission', async () => {
    const screen = await render(<TestFieldError />);
    await expect.element(screen.getByTestId('error')).toHaveTextContent('no error');
  });

  test('returns null after blur when field is valid', async () => {
    const screen = await render(<TestFieldError />);
    await userEvent.type(screen.getByTestId('field-input'), 'valid');
    await userEvent.click(screen.getByTestId('submit-btn'));
    await expect.element(screen.getByTestId('error')).toHaveTextContent('no error');
  });

  test('returns the error message after blur when field is invalid', async () => {
    const screen = await render(<TestFieldError />);
    await userEvent.type(screen.getByTestId('field-input'), 'ab');
    await userEvent.tab();
    await expect.element(screen.getByTestId('error')).toHaveTextContent('too short');
  });

  test('returns the error message after a submission attempt', async () => {
    const screen = await render(<TestFieldError />);
    await userEvent.type(screen.getByTestId('field-input'), 'ab');
    await userEvent.click(screen.getByTestId('submit-btn'));
    await expect.element(screen.getByTestId('error')).toHaveTextContent('too short');
  });
});
