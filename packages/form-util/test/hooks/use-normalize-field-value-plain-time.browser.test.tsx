import { render } from 'vitest-browser-react';

import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import { useNormalizeFieldValuePlainTime } from '#src/hooks/normalize-field-value-plain-time';
import { ErrorBoundary, FieldWrapper } from '#test/render-with';

const aPlainTime = Temporal.PlainTime.from('12:00:00');
const aPlainDateTime = Temporal.PlainDateTime.from('2024-06-15T12:00:00');
const aZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
const aPlainDate = Temporal.PlainDate.from('2024-06-15');

function PlainTimeDisplay() {
  const value = useNormalizeFieldValuePlainTime();
  return <div data-testid="value">{value === null ? 'null' : value.toString()}</div>;
}

describe('useNormalizeFieldValuePlainTime', () => {
  test('passes a Temporal.PlainTime through unchanged', async () => {
    const screen = await render(
      <FieldWrapper initialValue={aPlainTime}>
        <PlainTimeDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent(aPlainTime.toString());
  });

  test('converts a Temporal.ZonedDateTime to Temporal.PlainTime', async () => {
    const screen = await render(
      <FieldWrapper initialValue={aZonedDateTime}>
        <PlainTimeDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent(aZonedDateTime.toPlainTime().toString());
  });

  test('converts a Temporal.PlainDateTime to Temporal.PlainTime', async () => {
    const screen = await render(
      <FieldWrapper initialValue={aPlainDateTime}>
        <PlainTimeDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent(aPlainDateTime.toPlainTime().toString());
  });

  test('returns null for null', async () => {
    const screen = await render(
      <FieldWrapper initialValue={null}>
        <PlainTimeDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent('null');
  });

  test('returns null for undefined', async () => {
    const screen = await render(
      <FieldWrapper initialValue={undefined}>
        <PlainTimeDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent('null');
  });

  test('throws FormTypeError for a Temporal.PlainDate field value', async () => {
    const screen = await render(
      <ErrorBoundary>
        <FieldWrapper initialValue={aPlainDate}>
          <PlainTimeDisplay />
        </FieldWrapper>
      </ErrorBoundary>,
    );
    await expect.element(screen.getByTestId('error-name')).toHaveTextContent('FormTypeError');
  });
});
