import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vite-plus/test';
import { render } from 'vitest-browser-react';

import { useNormalizeFieldValuePlainDateTime } from '#src/hooks/normalize-field-value-plain-date-time';

import { ErrorBoundary, FieldWrapper } from '#test/render-with';

const aPlainDateTime = Temporal.PlainDateTime.from('2024-06-15T12:00:00');
const aZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
const aPlainDate = Temporal.PlainDate.from('2024-06-15');

function PlainDateTimeDisplay() {
  const value = useNormalizeFieldValuePlainDateTime();
  return <div data-testid="value">{value === null ? 'null' : value.toString()}</div>;
}

describe('useNormalizeFieldValuePlainDateTime', () => {
  it('passes a Temporal.PlainDateTime through unchanged', async () => {
    const screen = await render(
      <FieldWrapper initialValue={aPlainDateTime}>
        <PlainDateTimeDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent(aPlainDateTime.toString());
  });

  it('converts a Temporal.ZonedDateTime to Temporal.PlainDateTime', async () => {
    const screen = await render(
      <FieldWrapper initialValue={aZonedDateTime}>
        <PlainDateTimeDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent(aZonedDateTime.toPlainDateTime().toString());
  });

  it('returns null for null', async () => {
    const screen = await render(
      <FieldWrapper initialValue={null}>
        <PlainDateTimeDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent('null');
  });

  it('returns null for undefined', async () => {
    const screen = await render(
      <FieldWrapper initialValue={undefined}>
        <PlainDateTimeDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent('null');
  });

  it('throws FormTypeError for a Temporal.PlainDate field value', async () => {
    const screen = await render(
      <ErrorBoundary>
        <FieldWrapper initialValue={aPlainDate}>
          <PlainDateTimeDisplay />
        </FieldWrapper>
      </ErrorBoundary>,
    );
    await expect.element(screen.getByTestId('error-name')).toHaveTextContent('FormTypeError');
  });
});
