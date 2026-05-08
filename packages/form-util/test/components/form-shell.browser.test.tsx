import { render } from 'vitest-browser-react';

import { useStore } from '@tanstack/react-form';

import { describe, expect, test } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser';

import { FormShell } from '#src/components/form-shell';
import { useFormContext } from '#src/tanstack-form.config';
import { FormWrapper } from '#test/render-with';

function SubmissionCounter() {
  const form = useFormContext();
  const count = useStore(form.store, (state) => state.submissionAttempts);
  return <div data-testid="submission-count">{count}</div>;
}

describe('formShell', () => {
  test('renders children', async () => {
    const screen = await render(
      <FormWrapper formOptions={{ defaultValues: {}, onSubmit: async () => {} }}>
        <FormShell aria-label="test form">
          <div data-testid="child">hello</div>
        </FormShell>
      </FormWrapper>,
    );
    await expect.element(screen.getByTestId('child')).toHaveTextContent('hello');
  });

  test('sets autoComplete to off by default', async () => {
    const screen = await render(
      <FormWrapper formOptions={{ defaultValues: {}, onSubmit: async () => {} }}>
        <FormShell aria-label="test form">
          <span />
        </FormShell>
      </FormWrapper>,
    );
    await expect.element(screen.getByRole('form')).toHaveAttribute('autocomplete', 'off');
  });

  test('allows overriding autoComplete', async () => {
    const screen = await render(
      <FormWrapper formOptions={{ defaultValues: {}, onSubmit: async () => {} }}>
        <FormShell
          aria-label="test form"
          autoComplete="on"
        >
          <span />
        </FormShell>
      </FormWrapper>,
    );
    await expect.element(screen.getByRole('form')).toHaveAttribute('autocomplete', 'on');
  });

  test('calls form handleSubmit when submitted via default handler', async () => {
    const screen = await render(
      <FormWrapper formOptions={{ defaultValues: {}, onSubmit: async () => {} }}>
        <SubmissionCounter />
        <FormShell aria-label="test form">
          <button
            type="submit"
            data-testid="submit-btn"
          >
            Submit
          </button>
        </FormShell>
      </FormWrapper>,
    );
    await expect.element(screen.getByTestId('submission-count')).toHaveTextContent('0');
    await userEvent.click(screen.getByTestId('submit-btn'));
    await expect.element(screen.getByTestId('submission-count')).toHaveTextContent('1');
  });

  test('uses custom onSubmit when provided', async () => {
    let customSubmitCalled = false;

    const screen = await render(
      <FormWrapper formOptions={{ defaultValues: {}, onSubmit: async () => {} }}>
        <SubmissionCounter />
        <FormShell
          aria-label="test form"
          onSubmit={(e) => {
            e.preventDefault();
            customSubmitCalled = true;
          }}
        >
          <button
            type="submit"
            data-testid="submit-btn"
          >
            Submit
          </button>
        </FormShell>
      </FormWrapper>,
    );
    await userEvent.click(screen.getByTestId('submit-btn'));
    expect(customSubmitCalled).toBeTruthy();
    await expect.element(screen.getByTestId('submission-count')).toHaveTextContent('0');
  });

  test('calls form reset when reset via default handler', async () => {
    const screen = await render(
      <FormWrapper formOptions={{ defaultValues: {}, onSubmit: async () => {} }}>
        <FormShell aria-label="test form">
          <button
            type="reset"
            data-testid="reset-btn"
          >
            Reset
          </button>
        </FormShell>
      </FormWrapper>,
    );
    await userEvent.click(screen.getByTestId('reset-btn'));
    await expect.element(screen.getByRole('form')).toBeVisible();
  });
});
