import { render } from 'vitest-browser-react';

import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import { useNormalizeFieldValueInstant } from '#src/hooks/normalize-field-value-instant';
import { ErrorBoundary, FieldWrapper } from '#test/render-with';

const anInstant = Temporal.Instant.from('2024-06-15T12:00:00Z');
const aZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
const aPlainDate = Temporal.PlainDate.from('2024-06-15');

function InstantDisplay() {
  const value = useNormalizeFieldValueInstant();
  return <div data-testid="value">{value === null ? 'null' : value.toString()}</div>;
}

describe('useNormalizeFieldValueInstant', () => {
  test('passes a Temporal.Instant through unchanged', async () => {
    const screen = await render(
      <FieldWrapper initialValue={anInstant}>
        <InstantDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent(anInstant.toString());
  });

  test('converts a Temporal.ZonedDateTime to Temporal.Instant', async () => {
    const screen = await render(
      <FieldWrapper initialValue={aZonedDateTime}>
        <InstantDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent(aZonedDateTime.toInstant().toString());
  });

  test('returns null for null', async () => {
    const screen = await render(
      <FieldWrapper initialValue={null}>
        <InstantDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent('null');
  });

  test('returns null for undefined', async () => {
    const screen = await render(
      <FieldWrapper initialValue={undefined}>
        <InstantDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent('null');
  });

  test('throws FormTypeError for a Temporal.PlainDate field value', async () => {
    const screen = await render(
      <ErrorBoundary>
        <FieldWrapper initialValue={aPlainDate}>
          <InstantDisplay />
        </FieldWrapper>
      </ErrorBoundary>,
    );
    await expect.element(screen.getByTestId('error-name')).toHaveTextContent('FormTypeError');
  });

  test('throws FormTypeError for a string field value', async () => {
    const screen = await render(
      <ErrorBoundary>
        <FieldWrapper initialValue="2024-06-15T12:00:00Z">
          <InstantDisplay />
        </FieldWrapper>
      </ErrorBoundary>,
    );
    await expect.element(screen.getByTestId('error-name')).toHaveTextContent('FormTypeError');
  });
});
