import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { describe, expect, it } from 'vitest';

import { plainTime } from '#src/schemas/plain-time';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

const testPlainTime = Temporal.PlainTime.from('10:30:00');
const testZonedDateTime = Temporal.ZonedDateTime.from('2024-01-15T10:30:00+00:00[UTC]');
const testPlainDateTime = Temporal.PlainDateTime.from('2024-01-15T10:30:00');

describe('plainTime (nullable)', () => {
  const schema = plainTime(wrongTypeMessages);

  it('passes null through', () => {
    expect(v.safeParse(schema, null)).toMatchObject({ success: true, output: null });
  });

  it('coerces undefined to null', () => {
    expect(v.safeParse(schema, undefined)).toMatchObject({ success: true, output: null });
  });

  it('passes a Temporal.PlainTime through', () => {
    expect(v.safeParse(schema, testPlainTime)).toMatchObject({ success: true, output: testPlainTime });
  });

  it('converts Temporal.ZonedDateTime to Temporal.PlainTime', () => {
    const result = v.safeParse(schema, testZonedDateTime);
    expect(result.success).toBe(true);
    expect(result.output).toBeInstanceOf(Temporal.PlainTime);
    expect((result.output as Temporal.PlainTime).toString()).toBe('10:30:00');
  });

  it('converts Temporal.PlainDateTime to Temporal.PlainTime', () => {
    const result = v.safeParse(schema, testPlainDateTime);
    expect(result.success).toBe(true);
    expect(result.output).toBeInstanceOf(Temporal.PlainTime);
    expect((result.output as Temporal.PlainTime).toString()).toBe('10:30:00');
  });

  it('rejects time strings with wrongTypeMessage', () => {
    const result = v.safeParse(schema, '10:30:00');
    expect(result.success).toBe(false);
    expect(result.issues?.[0]?.message).toBe('Wrong type');
  });

  it('rejects Temporal.PlainDate', () => {
    expect(v.safeParse(schema, Temporal.PlainDate.from('2024-01-15')).success).toBe(false);
  });

  it('rejects numbers', () => {
    expect(v.safeParse(schema, 1030).success).toBe(false);
  });
});

describe('plainTime (required)', () => {
  const schema = plainTime(requiredMessages);

  it('passes a Temporal.PlainTime through', () => {
    expect(v.safeParse(schema, testPlainTime)).toMatchObject({ success: true, output: testPlainTime });
  });

  it('converts Temporal.ZonedDateTime to Temporal.PlainTime', () => {
    const result = v.safeParse(schema, testZonedDateTime);
    expect(result.success).toBe(true);
    expect(result.output).toBeInstanceOf(Temporal.PlainTime);
  });

  it('converts Temporal.PlainDateTime to Temporal.PlainTime', () => {
    const result = v.safeParse(schema, testPlainDateTime);
    expect(result.success).toBe(true);
    expect(result.output).toBeInstanceOf(Temporal.PlainTime);
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
    const result = v.safeParse(schema, '10:30:00');
    expect(result.success).toBe(false);
    expect(result.issues?.[0]?.message).toBe('Wrong type');
  });
});
