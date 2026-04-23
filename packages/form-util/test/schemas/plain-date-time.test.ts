import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { describe, expect, it } from 'vitest';

import { plainDateTime } from '#src/schemas/plain-date-time';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

const testPlainDateTime = Temporal.PlainDateTime.from('2024-06-15T14:30:00');
const testZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T14:30:00+00:00[UTC]');

describe('plainDateTime (nullable)', () => {
  const schema = plainDateTime(wrongTypeMessages);

  it('passes null through', () => {
    expect(v.safeParse(schema, null)).toMatchObject({ success: true, output: null });
  });

  it('coerces undefined to null', () => {
    expect(v.safeParse(schema, undefined)).toMatchObject({ success: true, output: null });
  });

  it('passes a Temporal.PlainDateTime through', () => {
    expect(v.safeParse(schema, testPlainDateTime)).toMatchObject({ success: true, output: testPlainDateTime });
  });

  it('converts Temporal.ZonedDateTime to Temporal.PlainDateTime', () => {
    const result = v.safeParse(schema, testZonedDateTime);
    expect(result.success).toBe(true);
    expect(result.output).toBeInstanceOf(Temporal.PlainDateTime);
    expect((result.output as Temporal.PlainDateTime).toString()).toBe('2024-06-15T14:30:00');
  });

  it('rejects ISO strings with wrongTypeMessage', () => {
    const result = v.safeParse(schema, '2024-06-15T14:30:00');
    expect(result.success).toBe(false);
    expect(result.issues?.[0]?.message).toBe('Wrong type');
  });

  it('rejects Temporal.PlainDate', () => {
    expect(v.safeParse(schema, Temporal.PlainDate.from('2024-06-15')).success).toBe(false);
  });

  it('rejects Temporal.PlainTime', () => {
    expect(v.safeParse(schema, Temporal.PlainTime.from('14:30:00')).success).toBe(false);
  });

  it('rejects numbers', () => {
    expect(v.safeParse(schema, 0).success).toBe(false);
  });
});

describe('plainDateTime (required)', () => {
  const schema = plainDateTime(requiredMessages);

  it('passes a Temporal.PlainDateTime through', () => {
    expect(v.safeParse(schema, testPlainDateTime)).toMatchObject({ success: true, output: testPlainDateTime });
  });

  it('converts Temporal.ZonedDateTime to Temporal.PlainDateTime', () => {
    const result = v.safeParse(schema, testZonedDateTime);
    expect(result.success).toBe(true);
    expect(result.output).toBeInstanceOf(Temporal.PlainDateTime);
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
    const result = v.safeParse(schema, '2024-06-15T14:30:00');
    expect(result.success).toBe(false);
    expect(result.issues?.[0]?.message).toBe('Wrong type');
  });
});
