import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { describe, expect, test } from 'vite-plus/test';

import { plainDateTime } from '#src/schemas/plain-date-time';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

const aPlainDateTime = Temporal.PlainDateTime.from('2024-06-15T12:30:00');
const aZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T12:30:00+00:00[UTC]');

describe('plainDateTime', () => {
  describe('nullable overload', () => {
    const schema = plainDateTime(wrongTypeMessages);

    test('passes null through', () => {
      expect(v.safeParse(schema, null)).toMatchObject({ success: true, output: null });
    });

    test('coerces undefined to null', () => {
      expect(v.safeParse(schema, undefined)).toMatchObject({ success: true, output: null });
    });

    test('passes a Temporal.PlainDateTime', () => {
      expect(v.safeParse(schema, aPlainDateTime)).toMatchObject({ success: true, output: aPlainDateTime });
    });

    test('converts a Temporal.ZonedDateTime to Temporal.PlainDateTime', () => {
      const result = v.safeParse(schema, aZonedDateTime);
      expect(result.success).toBeTruthy();
      expect(result.output).toStrictEqual(aZonedDateTime.toPlainDateTime());
    });

    test('rejects strings with wrongTypeMessage', () => {
      const result = v.safeParse(schema, '2024-06-15T12:30:00');
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    test('rejects numbers', () => {
      expect(v.safeParse(schema, 0).success).toBeFalsy();
    });

    test('rejects objects', () => {
      expect(v.safeParse(schema, {}).success).toBeFalsy();
    });

    test('rejects Temporal.PlainDate', () => {
      expect(v.safeParse(schema, Temporal.PlainDate.from('2024-06-15')).success).toBeFalsy();
    });

    test('rejects Temporal.Instant', () => {
      expect(v.safeParse(schema, Temporal.Instant.from('2024-06-15T00:00:00Z')).success).toBeFalsy();
    });

    test('passes extra plain date-time actions', () => {
      const schemaWithAction = plainDateTime(
        wrongTypeMessages,
        v.check((val) => val.hour >= 9, 'before business hours'),
      );
      expect(v.safeParse(schemaWithAction, Temporal.PlainDateTime.from('2024-06-15T08:00:00')).success).toBeFalsy();
      expect(v.safeParse(schemaWithAction, Temporal.PlainDateTime.from('2024-06-15T09:00:00')).success).toBeTruthy();
    });
  });

  describe('required overload', () => {
    const schema = plainDateTime(requiredMessages);

    test('passes a Temporal.PlainDateTime', () => {
      expect(v.safeParse(schema, aPlainDateTime)).toMatchObject({ success: true, output: aPlainDateTime });
    });

    test('converts a Temporal.ZonedDateTime to Temporal.PlainDateTime', () => {
      const result = v.safeParse(schema, aZonedDateTime);
      expect(result.success).toBeTruthy();
      expect(result.output).toStrictEqual(aZonedDateTime.toPlainDateTime());
    });

    test('rejects null with requiredMessage', () => {
      const result = v.safeParse(schema, null);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Required');
    });

    test('rejects undefined with requiredMessage', () => {
      const result = v.safeParse(schema, undefined);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Required');
    });

    test('rejects strings with wrongTypeMessage', () => {
      const result = v.safeParse(schema, '2024-06-15T12:30:00');
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    test('rejects numbers with wrongTypeMessage', () => {
      const result = v.safeParse(schema, 0);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    test('passes extra plain date-time actions', () => {
      const schemaWithAction = plainDateTime(
        requiredMessages,
        v.check((val) => val.hour >= 9, 'before business hours'),
      );
      expect(v.safeParse(schemaWithAction, Temporal.PlainDateTime.from('2024-06-15T08:00:00')).success).toBeFalsy();
      expect(v.safeParse(schemaWithAction, Temporal.PlainDateTime.from('2024-06-15T09:00:00')).success).toBeTruthy();
    });
  });
});
