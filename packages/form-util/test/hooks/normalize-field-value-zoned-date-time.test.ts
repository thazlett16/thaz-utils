import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vitest';

import { FormTypeError } from '#src/error';
import { normalizeFieldValueZonedDateTime } from '#src/hooks/normalize-field-value-zoned-date-time';

const aZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
const anInstant = Temporal.Instant.from('2024-06-15T12:00:00Z');
const aPlainDate = Temporal.PlainDate.from('2024-06-15');

describe('normalizeFieldValueZonedDateTime', () => {
  it('passes a Temporal.ZonedDateTime through unchanged', () => {
    expect(normalizeFieldValueZonedDateTime(aZonedDateTime)).toBe(aZonedDateTime);
  });

  it('returns null for null input', () => {
    expect(normalizeFieldValueZonedDateTime(null)).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(normalizeFieldValueZonedDateTime(undefined)).toBeNull();
  });

  it('throws FormTypeError for Temporal.Instant input', () => {
    expect(() => normalizeFieldValueZonedDateTime(anInstant as never)).toThrow(FormTypeError);
  });

  it('throws FormTypeError for Temporal.PlainDate input', () => {
    expect(() => normalizeFieldValueZonedDateTime(aPlainDate as never)).toThrow(FormTypeError);
  });
});
