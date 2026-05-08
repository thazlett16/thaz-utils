import { render } from 'vitest-browser-react';

import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import { useNormalizeFieldValuePlainDate } from '#src/hooks/normalize-field-value-plain-date';
import { ErrorBoundary, FieldWrapper } from '#test/render-with';

const aPlainDate = Temporal.PlainDate.from('2024-06-15');
const aPlainDateTime = Temporal.PlainDateTime.from('2024-06-15T12:00:00');
const aZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
const anInstant = Temporal.Instant.from('2024-06-15T12:00:00Z');

function PlainDateDisplay() {
  const value = useNormalizeFieldValuePlainDate();
  return <div data-testid="value">{value === null ? 'null' : value.toString()}</div>;
}

describe('useNormalizeFieldValuePlainDate', () => {
  test('passes a Temporal.PlainDate through unchanged', async () => {
    const screen = await render(
      <FieldWrapper initialValue={aPlainDate}>
        <PlainDateDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent(aPlainDate.toString());
  });

  test('converts a Temporal.ZonedDateTime to Temporal.PlainDate', async () => {
    const screen = await render(
      <FieldWrapper initialValue={aZonedDateTime}>
        <PlainDateDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent(aZonedDateTime.toPlainDate().toString());
  });

  test('converts a Temporal.PlainDateTime to Temporal.PlainDate', async () => {
    const screen = await render(
      <FieldWrapper initialValue={aPlainDateTime}>
        <PlainDateDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent(aPlainDateTime.toPlainDate().toString());
  });

  test('returns null for null', async () => {
    const screen = await render(
      <FieldWrapper initialValue={null}>
        <PlainDateDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent('null');
  });

  test('returns null for undefined', async () => {
    const screen = await render(
      <FieldWrapper initialValue={undefined}>
        <PlainDateDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent('null');
  });

  test('throws FormTypeError for a Temporal.Instant field value', async () => {
    const screen = await render(
      <ErrorBoundary>
        <FieldWrapper initialValue={anInstant}>
          <PlainDateDisplay />
        </FieldWrapper>
      </ErrorBoundary>,
    );
    await expect.element(screen.getByTestId('error-name')).toHaveTextContent('FormTypeError');
  });

  test('throws FormTypeError for a string field value', async () => {
    const screen = await render(
      <ErrorBoundary>
        <FieldWrapper initialValue="2024-06-15">
          <PlainDateDisplay />
        </FieldWrapper>
      </ErrorBoundary>,
    );
    await expect.element(screen.getByTestId('error-name')).toHaveTextContent('FormTypeError');
  });
});
