import { useForm } from '@tanstack/react-form';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-react';

import { useCanSubmit } from '#src/hooks/can-submit';
import { formContext } from '#src/tanstack-form.config';

function CanSubmitDisplay({ allowSubmitWhenInvalid = false }: { allowSubmitWhenInvalid?: boolean }) {
  const result = useCanSubmit({ allowSubmitWhenInvalid });
  return <div data-testid="can-submit">{String(result)}</div>;
}

function TestCanSubmit({ allowSubmitWhenInvalid = false }: { allowSubmitWhenInvalid?: boolean }) {
  const form = useForm({
    defaultValues: { name: '' },
    onSubmit: () => new Promise<void>(() => { /* never resolves to keep isSubmitting: true */ }),
  });

  return (
    // oxlint-disable-next-line typescript/no-explicit-any
    <formContext.Provider value={form as any}>
      <CanSubmitDisplay allowSubmitWhenInvalid={allowSubmitWhenInvalid} />
      <button data-testid="submit-btn" onClick={() => void form.handleSubmit()}>
        Submit
      </button>
    </formContext.Provider>
  );
}

function TestCanSubmitWithInvalidForm() {
  const form = useForm({
    defaultValues: { name: '' },
    onSubmit: () => new Promise<void>(() => { /* never resolves */ }),
  });

  return (
    // oxlint-disable-next-line typescript/no-explicit-any
    <formContext.Provider value={form as any}>
      <form.Field
        // oxlint-disable-next-line typescript/no-explicit-any
        name={'name' as any}
        validators={{ onChange: ({ value }: { value: string }) => (value.length > 0 && value.length < 3 ? 'too short' : undefined) }}
      >
        {/* oxlint-disable-next-line typescript/no-explicit-any */}
        {(field: any) => (
          <input
            data-testid="name-input"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>
      <CanSubmitDisplay allowSubmitWhenInvalid={true} />
      <button data-testid="submit-btn" onClick={() => void form.handleSubmit()}>
        Submit
      </button>
    </formContext.Provider>
  );
}

describe('useCanSubmit', () => {
  describe('allowSubmitWhenInvalid: false (default)', () => {
    it('returns true when form is idle', async () => {
      const screen = await render(<TestCanSubmit />);
      await expect.element(screen.getByTestId('can-submit')).toHaveTextContent('true');
    });

    it('returns false while form is submitting', async () => {
      const screen = await render(<TestCanSubmit />);
      await userEvent.click(screen.getByTestId('submit-btn'));
      await expect.element(screen.getByTestId('can-submit')).toHaveTextContent('false');
    });
  });

  describe('allowSubmitWhenInvalid: true', () => {
    it('returns true when form is idle and valid', async () => {
      const screen = await render(<TestCanSubmitWithInvalidForm />);
      await expect.element(screen.getByTestId('can-submit')).toHaveTextContent('true');
    });

    it('returns false when form has validation errors', async () => {
      const screen = await render(<TestCanSubmitWithInvalidForm />);
      await userEvent.type(screen.getByTestId('name-input'), 'ab');
      await expect.element(screen.getByTestId('can-submit')).toHaveTextContent('false');
    });

    it('returns false while form is submitting', async () => {
      const screen = await render(<TestCanSubmitWithInvalidForm />);
      await userEvent.type(screen.getByTestId('name-input'), 'valid name');
      await userEvent.click(screen.getByTestId('submit-btn'));
      await expect.element(screen.getByTestId('can-submit')).toHaveTextContent('false');
    });
  });
});
