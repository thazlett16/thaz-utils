import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { describe, expect, it } from 'vitest';

import { instant } from '#src/schemas/instant';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

const testInstant = Temporal.Instant.fromEpochMilliseconds(1_700_000_000_000);
const testZonedDateTime = Temporal.ZonedDateTime.from('2024-01-15T10:00:00+00:00[UTC]');

describe('instant (nullable)', () => {
  const schema = instant(wrongTypeMessages);

  it('passes null through', () => {
    expect(v.safeParse(schema, null)).toMatchObject({ success: true, output: null });
  });

  it('coerces undefined to null', () => {
    expect(v.safeParse(schema, undefined)).toMatchObject({ success: true, output: null });
  });

  it('passes a Temporal.Instant through', () => {
    expect(v.safeParse(schema, testInstant)).toMatchObject({ success: true, output: testInstant });
  });

  it('converts Temporal.ZonedDateTime to Temporal.Instant', () => {
    const result = v.safeParse(schema, testZonedDateTime);
    expect(result.success).toBe(true);
    expect(result.output).toBeInstanceOf(Temporal.Instant);
    expect((result.output as Temporal.Instant).epochMilliseconds).toBe(
      testZonedDateTime.toInstant().epochMilliseconds,
    );
  });

  it('rejects strings with wrongTypeMessage', () => {
    const result = v.safeParse(schema, '2024-01-15T10:00:00Z');
    expect(result.success).toBe(false);
    expect(result.issues?.[0]?.message).toBe('Wrong type');
  });

  it('rejects PlainDate', () => {
    expect(v.safeParse(schema, Temporal.PlainDate.from('2024-01-15')).success).toBe(false);
  });

  it('rejects PlainDateTime', () => {
    expect(v.safeParse(schema, Temporal.PlainDateTime.from('2024-01-15T10:00:00')).success).toBe(false);
  });

  it('rejects numbers', () => {
    expect(v.safeParse(schema, 0).success).toBe(false);
  });
});

describe('instant (required)', () => {
  const schema = instant(requiredMessages);

  it('passes a Temporal.Instant through', () => {
    expect(v.safeParse(schema, testInstant)).toMatchObject({ success: true, output: testInstant });
  });

  it('converts Temporal.ZonedDateTime to Temporal.Instant', () => {
    const result = v.safeParse(schema, testZonedDateTime);
    expect(result.success).toBe(true);
    expect(result.output).toBeInstanceOf(Temporal.Instant);
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
    const result = v.safeParse(schema, '2024-01-15T10:00:00Z');
    expect(result.success).toBe(false);
    expect(result.issues?.[0]?.message).toBe('Wrong type');
  });
});
