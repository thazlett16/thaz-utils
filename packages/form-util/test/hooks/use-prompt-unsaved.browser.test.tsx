import { describe, expect, it } from 'vite-plus/test';
import { render } from 'vitest-browser-react';

import { usePromptUnsaved } from '#src/hooks/prompt-unsaved';

import { createTestRouter, FormWrapper } from '#test/render-with';

function PromptUnsavedDisplay({ forceShow, forceHide }: { forceShow?: boolean; forceHide?: boolean }) {
  const blocker = usePromptUnsaved({ forceShow, forceHide });
  return <div data-testid="status">{blocker.status ?? 'idle'}</div>;
}

describe('usePromptUnsaved', () => {
  it('renders without throwing in a router + form context', async () => {
    const router = createTestRouter();
    const screen = await render(
      <FormWrapper router={router}>
        <PromptUnsavedDisplay />
      </FormWrapper>,
    );
    await expect.element(screen.getByTestId('status')).toBeVisible();
  });

  it('shows idle status when the form is clean', async () => {
    const router = createTestRouter();
    const screen = await render(
      <FormWrapper router={router}>
        <PromptUnsavedDisplay />
      </FormWrapper>,
    );
    await expect.element(screen.getByTestId('status')).toHaveTextContent('idle');
  });

  it('shows idle status when forceHide is true', async () => {
    const router = createTestRouter();
    const screen = await render(
      <FormWrapper router={router}>
        <PromptUnsavedDisplay forceHide={true} />
      </FormWrapper>,
    );
    await expect.element(screen.getByTestId('status')).toHaveTextContent('idle');
  });
});
