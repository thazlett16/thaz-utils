import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { describe, expect, it } from 'vitest';

import { plainDate } from '#src/schemas/plain-date';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

const testDate = Temporal.PlainDate.from('2024-06-15');
const testZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
const testPlainDateTime = Temporal.PlainDateTime.from('2024-06-15T12:00:00');

describe('plainDate (nullable)', () => {
  const schema = plainDate(wrongTypeMessages);

  it('passes null through', () => {
    expect(v.safeParse(schema, null)).toMatchObject({ success: true, output: null });
  });

  it('coerces undefined to null', () => {
    expect(v.safeParse(schema, undefined)).toMatchObject({ success: true, output: null });
  });

  it('passes a Temporal.PlainDate through', () => {
    expect(v.safeParse(schema, testDate)).toMatchObject({ success: true, output: testDate });
  });

  it('converts Temporal.ZonedDateTime to Temporal.PlainDate', () => {
    const result = v.safeParse(schema, testZonedDateTime);
    expect(result.success).toBe(true);
    expect(result.output).toBeInstanceOf(Temporal.PlainDate);
    expect((result.output as Temporal.PlainDate).toString()).toBe('2024-06-15');
  });

  it('converts Temporal.PlainDateTime to Temporal.PlainDate', () => {
    const result = v.safeParse(schema, testPlainDateTime);
    expect(result.success).toBe(true);
    expect(result.output).toBeInstanceOf(Temporal.PlainDate);
    expect((result.output as Temporal.PlainDate).toString()).toBe('2024-06-15');
  });

  it('rejects ISO date strings with wrongTypeMessage', () => {
    const result = v.safeParse(schema, '2024-06-15');
    expect(result.success).toBe(false);
    expect(result.issues?.[0]?.message).toBe('Wrong type');
  });

  it('rejects Temporal.Instant', () => {
    expect(v.safeParse(schema, Temporal.Instant.fromEpochMilliseconds(0)).success).toBe(false);
  });

  it('rejects Temporal.PlainTime', () => {
    expect(v.safeParse(schema, Temporal.PlainTime.from('10:00:00')).success).toBe(false);
  });

  it('rejects numbers', () => {
    expect(v.safeParse(schema, 20_240_615).success).toBe(false);
  });
});

describe('plainDate (required)', () => {
  const schema = plainDate(requiredMessages);

  it('passes a Temporal.PlainDate through', () => {
    expect(v.safeParse(schema, testDate)).toMatchObject({ success: true, output: testDate });
  });

  it('converts Temporal.ZonedDateTime to Temporal.PlainDate', () => {
    const result = v.safeParse(schema, testZonedDateTime);
    expect(result.success).toBe(true);
    expect(result.output).toBeInstanceOf(Temporal.PlainDate);
  });

  it('converts Temporal.PlainDateTime to Temporal.PlainDate', () => {
    const result = v.safeParse(schema, testPlainDateTime);
    expect(result.success).toBe(true);
    expect(result.output).toBeInstanceOf(Temporal.PlainDate);
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
    const result = v.safeParse(schema, '2024-06-15');
    expect(result.success).toBe(false);
    expect(result.issues?.[0]?.message).toBe('Wrong type');
  });
});
