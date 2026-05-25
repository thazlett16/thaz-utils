import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { assert, describe, expect, test } from 'vite-plus/test';

import { dayJS } from '#src/dayjs.config';
import { plainDateTime } from '#src/schemas/plain-date-time';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

const aPlainDateTime = Temporal.PlainDateTime.from('2024-06-15T09:30:00');
const aZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T09:30:00+00:00[UTC]');
const validDayjs = dayJS({ years: 2024, months: 5, dates: 15, hours: 9, minutes: 30, seconds: 0 });
const invalidDayjs = dayJS('not a date');

describe('plainDateTime', () => {
  describe('nullable overload', () => {
    const schema = plainDateTime(wrongTypeMessages);

    test('passes null through', () => {
      const result = v.safeParse(schema, null);
      assert.isTrue(result.success);
      expect(result.output).toBeNull();
    });

    test('coerces undefined to null', () => {
      const result = v.safeParse(schema, undefined);
      assert.isTrue(result.success);
      expect(result.output).toBeNull();
    });

    test('passes a Temporal.PlainDateTime', () => {
      const result = v.safeParse(schema, aPlainDateTime);
      assert.isTrue(result.success);
      assert.isNotNull(result.output);
      assert.instanceOf(result.output, Temporal.PlainDateTime);
      expect(aPlainDateTime.equals(result.output)).toBeTruthy();
    });

    test('converts a Temporal.ZonedDateTime to Temporal.PlainDateTime', () => {
      const result = v.safeParse(schema, aZonedDateTime);
      assert.isTrue(result.success);
      assert.isNotNull(result.output);
      assert.instanceOf(result.output, Temporal.PlainDateTime);
      expect(aZonedDateTime.toPlainDateTime().equals(result.output)).toBeTruthy();
    });

    test('converts a valid Dayjs to Temporal.PlainDateTime', () => {
      const result = v.safeParse(schema, validDayjs);
      assert.isTrue(result.success);
      assert.isNotNull(result.output);
      assert.instanceOf(result.output, Temporal.PlainDateTime);
      expect(aPlainDateTime.equals(result.output)).toBeTruthy();
    });

    test('passes extra plain date-time actions', () => {
      const minPdt = Temporal.PlainDateTime.from('2024-01-01T00:00:00');
      const schemaWithAction = plainDateTime(
        wrongTypeMessages,
        v.check((val) => Temporal.PlainDateTime.compare(val, minPdt) >= 0, 'too early'),
      );
      const failResult = v.safeParse(schemaWithAction, Temporal.PlainDateTime.from('2023-12-31T23:59:59'));
      expect(failResult.success).toBeFalsy();
      const passResult = v.safeParse(schemaWithAction, minPdt);
      expect(passResult.success).toBeTruthy();
    });

    describe('should return dataset with issues', () => {
      test('rejects an invalid Dayjs', () => {
        const result = v.safeParse(schema, invalidDayjs);
        expect(result.success).toBeFalsy();
      });

      test('rejects strings', () => {
        const result = v.safeParse(schema, '2024-06-15T09:30:00');
        expect(result.success).toBeFalsy();
      });

      test('rejects numbers', () => {
        const result = v.safeParse(schema, 0);
        expect(result.success).toBeFalsy();
      });

      test('rejects objects', () => {
        const result = v.safeParse(schema, {});
        expect(result.success).toBeFalsy();
      });

      test('rejects Temporal.Instant', () => {
        const result = v.safeParse(schema, Temporal.Instant.from('2024-06-15T00:00:00Z'));
        expect(result.success).toBeFalsy();
      });
    });
  });

  describe('required overload', () => {
    const schema = plainDateTime(requiredMessages);

    test('passes a Temporal.PlainDateTime', () => {
      const result = v.safeParse(schema, aPlainDateTime);
      assert.isTrue(result.success);
      expect(result.output).toStrictEqual(aPlainDateTime);
    });

    test('converts a valid Dayjs to Temporal.PlainDateTime', () => {
      const result = v.safeParse(schema, validDayjs);
      assert.isTrue(result.success);
      expect(result.output).toBeInstanceOf(Temporal.PlainDateTime);
    });

    test('passes extra plain date-time actions', () => {
      const minPdt = Temporal.PlainDateTime.from('2024-01-01T00:00:00');
      const schemaWithAction = plainDateTime(
        requiredMessages,
        v.check((val) => Temporal.PlainDateTime.compare(val, minPdt) >= 0, 'too early'),
      );
      const failResult = v.safeParse(schemaWithAction, Temporal.PlainDateTime.from('2023-12-31T23:59:59'));
      expect(failResult.success).toBeFalsy();
      const passResult = v.safeParse(schemaWithAction, minPdt);
      expect(passResult.success).toBeTruthy();
    });

    describe('should return dataset with issues', () => {
      test('rejects null', () => {
        const result = v.safeParse(schema, null);
        expect(result.success).toBeFalsy();
      });

      test('rejects undefined', () => {
        const result = v.safeParse(schema, undefined);
        expect(result.success).toBeFalsy();
      });

      test('rejects an invalid Dayjs', () => {
        const result = v.safeParse(schema, invalidDayjs);
        expect(result.success).toBeFalsy();
      });

      test('rejects strings', () => {
        const result = v.safeParse(schema, '2024-06-15T09:30:00');
        expect(result.success).toBeFalsy();
      });

      test('rejects numbers', () => {
        const result = v.safeParse(schema, 0);
        expect(result.success).toBeFalsy();
      });

      test('rejects objects', () => {
        const result = v.safeParse(schema, {});
        expect(result.success).toBeFalsy();
      });

      test('rejects Temporal.Instant', () => {
        const result = v.safeParse(schema, Temporal.Instant.from('2024-06-15T00:00:00Z'));
        expect(result.success).toBeFalsy();
      });
    });
  });
});
