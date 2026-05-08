import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vite-plus/test';
import { render } from 'vitest-browser-react';

import { useNormalizeFieldValueZonedDateTime } from '#src/hooks/normalize-field-value-zoned-date-time';

import { ErrorBoundary, FieldWrapper } from '#test/render-with';

const aZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
const anInstant = Temporal.Instant.from('2024-06-15T12:00:00Z');
const aPlainDate = Temporal.PlainDate.from('2024-06-15');

function ZonedDateTimeDisplay() {
  const value = useNormalizeFieldValueZonedDateTime();
  return <div data-testid="value">{value === null ? 'null' : value.toString()}</div>;
}

describe('useNormalizeFieldValueZonedDateTime', () => {
  it('passes a Temporal.ZonedDateTime through unchanged', async () => {
    const screen = await render(
      <FieldWrapper initialValue={aZonedDateTime}>
        <ZonedDateTimeDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent(aZonedDateTime.toString());
  });

  it('returns null for null', async () => {
    const screen = await render(
      <FieldWrapper initialValue={null}>
        <ZonedDateTimeDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent('null');
  });

  it('returns null for undefined', async () => {
    const screen = await render(
      <FieldWrapper initialValue={undefined}>
        <ZonedDateTimeDisplay />
      </FieldWrapper>,
    );
    await expect.element(screen.getByTestId('value')).toHaveTextContent('null');
  });

  it('throws FormTypeError for a Temporal.Instant field value', async () => {
    const screen = await render(
      <ErrorBoundary>
        <FieldWrapper initialValue={anInstant}>
          <ZonedDateTimeDisplay />
        </FieldWrapper>
      </ErrorBoundary>,
    );
    await expect.element(screen.getByTestId('error-name')).toHaveTextContent('FormTypeError');
  });

  it('throws FormTypeError for a Temporal.PlainDate field value', async () => {
    const screen = await render(
      <ErrorBoundary>
        <FieldWrapper initialValue={aPlainDate}>
          <ZonedDateTimeDisplay />
        </FieldWrapper>
      </ErrorBoundary>,
    );
    await expect.element(screen.getByTestId('error-name')).toHaveTextContent('FormTypeError');
  });
});
