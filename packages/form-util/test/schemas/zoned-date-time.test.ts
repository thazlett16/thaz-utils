import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { describe, expect, it } from 'vitest';

import { zonedDateTime } from '#src/schemas/zoned-date-time';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

const testZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');

describe('zonedDateTime (nullable)', () => {
  const schema = zonedDateTime(wrongTypeMessages);

  it('passes null through', () => {
    expect(v.safeParse(schema, null)).toMatchObject({ success: true, output: null });
  });

  it('coerces undefined to null', () => {
    expect(v.safeParse(schema, undefined)).toMatchObject({ success: true, output: null });
  });

  it('passes a Temporal.ZonedDateTime through', () => {
    expect(v.safeParse(schema, testZonedDateTime)).toMatchObject({ success: true, output: testZonedDateTime });
  });

  it('does not auto-convert Temporal.Instant', () => {
    expect(v.safeParse(schema, Temporal.Instant.fromEpochMilliseconds(0)).success).toBe(false);
  });

  it('does not auto-convert Temporal.PlainDate', () => {
    expect(v.safeParse(schema, Temporal.PlainDate.from('2024-06-15')).success).toBe(false);
  });

  it('does not auto-convert Temporal.PlainDateTime', () => {
    expect(v.safeParse(schema, Temporal.PlainDateTime.from('2024-06-15T12:00:00')).success).toBe(false);
  });

  it('rejects ISO strings with wrongTypeMessage', () => {
    const result = v.safeParse(schema, '2024-06-15T12:00:00+00:00[UTC]');
    expect(result.success).toBe(false);
    expect(result.issues?.[0]?.message).toBe('Wrong type');
  });

  it('rejects numbers', () => {
    expect(v.safeParse(schema, 0).success).toBe(false);
  });
});

describe('zonedDateTime (required)', () => {
  const schema = zonedDateTime(requiredMessages);

  it('passes a Temporal.ZonedDateTime through', () => {
    expect(v.safeParse(schema, testZonedDateTime)).toMatchObject({ success: true, output: testZonedDateTime });
  });

  it('rejects null with requiredMessage', () => {
    const result = v.safeParse(schema, null);
    expect(result.success).toBe(false);
    expect(result.issues?.[0]?.message).toBe('Required');
  });

  it('rejects undefined with requiredMessage', () => {
    const result = v.safeParse(schema, undefined);
    expect(result.success).toBe(false);
    expect(result.issues?.[0]?.message).toBe('Required');
  });

  it('rejects strings with wrongTypeMessage', () => {
    const result = v.safeParse(schema, '2024-06-15T12:00:00+00:00[UTC]');
    expect(result.success).toBe(false);
    expect(result.issues?.[0]?.message).toBe('Wrong type');
  });

  it('rejects Temporal.PlainDate', () => {
    expect(v.safeParse(schema, Temporal.PlainDate.from('2024-06-15')).success).toBe(false);
  });
});
