import { describe, expect, it } from 'vite-plus/test';
import { render } from 'vitest-browser-react';

import { useNormalizeFieldValueString } from '#src/hooks/normalize-field-value-string';

import { ErrorBoundary, FieldWrapper } from '#test/render-with';

function StringDisplay() {
  const value = useNormalizeFieldValueString();
  return <div data-testid="value">{value}</div>;
}

describe('useNormalizeFieldValueString', () => {
  it('returns a string value unchanged', async () => {
    const screen = await render(
      <FieldWrapper initialValue="hello">
        <StringDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent('hello');
  });

  it('returns an empty string unchanged', async () => {
    const screen = await render(
      <FieldWrapper initialValue="">
        <StringDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent('');
  });

  it('returns empty string for null', async () => {
    const screen = await render(
      <FieldWrapper initialValue={null}>
        <StringDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent('');
  });

  it('returns empty string for undefined', async () => {
    const screen = await render(
      <FieldWrapper initialValue={undefined}>
        <StringDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent('');
  });

  it('throws FormTypeError for a number field value', async () => {
    const screen = await render(
      <ErrorBoundary>
        <FieldWrapper initialValue={42}>
          <StringDisplay />
        </FieldWrapper>
      </ErrorBoundary>,
    );
    await expect.element(screen.getByTestId('error-name')).toHaveTextContent('FormTypeError');
  });

  it('throws FormTypeError for an object field value', async () => {
    const screen = await render(
      <ErrorBoundary>
        <FieldWrapper initialValue={{}}>
          <StringDisplay />
        </FieldWrapper>
      </ErrorBoundary>,
    );
    await expect.element(screen.getByTestId('error-name')).toHaveTextContent('FormTypeError');
  });
});
