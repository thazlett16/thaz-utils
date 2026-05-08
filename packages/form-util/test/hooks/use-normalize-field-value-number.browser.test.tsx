import { describe, expect, it } from 'vite-plus/test';
import { render } from 'vitest-browser-react';

import { useNormalizeFieldValueNumber } from '#src/hooks/normalize-field-value-number';

import { ErrorBoundary, FieldWrapper } from '#test/render-with';

function NumberDisplay() {
  const value = useNormalizeFieldValueNumber();
  return <div data-testid="value">{value === null ? 'null' : String(value)}</div>;
}

describe('useNormalizeFieldValueNumber', () => {
  it('returns a number value unchanged', async () => {
    const screen = await render(
      <FieldWrapper initialValue={42}>
        <NumberDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent('42');
  });

  it('returns 0 unchanged', async () => {
    const screen = await render(
      <FieldWrapper initialValue={0}>
        <NumberDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent('0');
  });

  it('returns null for null', async () => {
    const screen = await render(
      <FieldWrapper initialValue={null}>
        <NumberDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent('null');
  });

  it('returns null for undefined', async () => {
    const screen = await render(
      <FieldWrapper initialValue={undefined}>
        <NumberDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent('null');
  });

  it('throws FormTypeError for a string field value', async () => {
    const screen = await render(
      <ErrorBoundary>
        <FieldWrapper initialValue="42">
          <NumberDisplay />
        </FieldWrapper>
      </ErrorBoundary>,
    );
    await expect.element(screen.getByTestId('error-name')).toHaveTextContent('FormTypeError');
  });
});
