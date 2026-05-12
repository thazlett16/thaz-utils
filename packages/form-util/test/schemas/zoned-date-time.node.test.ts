import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { describe, expect, test } from 'vite-plus/test';

import { zonedDateTime } from '#src/schemas/zoned-date-time';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

const aZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
const aZonedDateTimeWithTz = Temporal.ZonedDateTime.from('2024-06-15T08:00:00-05:00[America/Chicago]');

describe('zonedDateTime', () => {
  describe('nullable overload', () => {
    const schema = zonedDateTime(wrongTypeMessages);

    test('passes null through', () => {
      expect(v.safeParse(schema, null)).toMatchObject({ success: true, output: null });
    });

    test('coerces undefined to null', () => {
      expect(v.safeParse(schema, undefined)).toMatchObject({ success: true, output: null });
    });

    test('passes a Temporal.ZonedDateTime in UTC', () => {
      expect(v.safeParse(schema, aZonedDateTime)).toMatchObject({ success: true, output: aZonedDateTime });
    });

    test('passes a Temporal.ZonedDateTime with named timezone', () => {
      expect(v.safeParse(schema, aZonedDateTimeWithTz)).toMatchObject({
        success: true,
        output: aZonedDateTimeWithTz,
      });
    });

    test('rejects strings with wrongTypeMessage', () => {
      const result = v.safeParse(schema, '2024-06-15T12:00:00+00:00[UTC]');
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    test('rejects numbers', () => {
      expect(v.safeParse(schema, 0).success).toBeFalsy();
    });

    test('rejects objects', () => {
      expect(v.safeParse(schema, {}).success).toBeFalsy();
    });

    test('rejects Temporal.Instant', () => {
      expect(v.safeParse(schema, Temporal.Instant.from('2024-06-15T00:00:00Z')).success).toBeFalsy();
    });

    test('rejects Temporal.PlainDate', () => {
      expect(v.safeParse(schema, Temporal.PlainDate.from('2024-06-15')).success).toBeFalsy();
    });

    test('rejects Temporal.PlainDateTime', () => {
      expect(v.safeParse(schema, Temporal.PlainDateTime.from('2024-06-15T12:00:00')).success).toBeFalsy();
    });

    test('rejects Temporal.PlainTime', () => {
      expect(v.safeParse(schema, Temporal.PlainTime.from('12:00:00')).success).toBeFalsy();
    });

    test('passes extra zoned date-time actions', () => {
      const minZdt = Temporal.ZonedDateTime.from('2024-01-01T00:00:00+00:00[UTC]');
      const schemaWithAction = zonedDateTime(
        wrongTypeMessages,
        v.check((val) => Temporal.ZonedDateTime.compare(val, minZdt) >= 0, 'too early'),
      );
      expect(
        v.safeParse(schemaWithAction, Temporal.ZonedDateTime.from('2023-12-31T23:59:59+00:00[UTC]')).success,
      ).toBeFalsy();
      expect(v.safeParse(schemaWithAction, minZdt).success).toBeTruthy();
    });
  });

  describe('required overload', () => {
    const schema = zonedDateTime(requiredMessages);

    test('passes a Temporal.ZonedDateTime', () => {
      expect(v.safeParse(schema, aZonedDateTime)).toMatchObject({ success: true, output: aZonedDateTime });
    });

    test('passes a Temporal.ZonedDateTime with named timezone', () => {
      expect(v.safeParse(schema, aZonedDateTimeWithTz)).toMatchObject({
        success: true,
        output: aZonedDateTimeWithTz,
      });
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
      const result = v.safeParse(schema, '2024-06-15T12:00:00+00:00[UTC]');
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    test('rejects numbers with wrongTypeMessage', () => {
      const result = v.safeParse(schema, 0);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    test('passes extra zoned date-time actions', () => {
      const minZdt = Temporal.ZonedDateTime.from('2024-01-01T00:00:00+00:00[UTC]');
      const schemaWithAction = zonedDateTime(
        requiredMessages,
        v.check((val) => Temporal.ZonedDateTime.compare(val, minZdt) >= 0, 'too early'),
      );
      expect(
        v.safeParse(schemaWithAction, Temporal.ZonedDateTime.from('2023-12-31T23:59:59+00:00[UTC]')).success,
      ).toBeFalsy();
      expect(v.safeParse(schemaWithAction, minZdt).success).toBeTruthy();
    });
  });
});
