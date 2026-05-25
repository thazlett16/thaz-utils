import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { assert, describe, expect, test } from 'vite-plus/test';

import { dayJS } from '#src/dayjs.config';
import { plainTime } from '#src/schemas/plain-time';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

const aPlainTime = Temporal.PlainTime.from('09:30:00');
const aZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T09:30:00+00:00[UTC]');
const aPlainDateTime = Temporal.PlainDateTime.from('2024-06-15T09:30:00');
const validDayjs = dayJS({ hours: 9, minutes: 30, seconds: 0, milliseconds: 0 });
const invalidDayjs = dayJS('not a date');

describe('plainTime', () => {
  describe('nullable overload', () => {
    const schema = plainTime(wrongTypeMessages);

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

    test('passes a Temporal.PlainTime', () => {
      const result = v.safeParse(schema, aPlainTime);
      assert.isTrue(result.success);
      assert.isNotNull(result.output);
      assert.instanceOf(result.output, Temporal.PlainTime);
      expect(aPlainTime.equals(result.output)).toBeTruthy();
    });

    test('converts a Temporal.PlainDateTime to Temporal.PlainTime', () => {
      const result = v.safeParse(schema, aPlainDateTime);
      assert.isTrue(result.success);
      assert.isNotNull(result.output);
      assert.instanceOf(result.output, Temporal.PlainTime);
      expect(aPlainDateTime.toPlainTime().equals(result.output)).toBeTruthy();
    });

    test('converts a Temporal.ZonedDateTime to Temporal.PlainTime', () => {
      const result = v.safeParse(schema, aZonedDateTime);
      assert.isTrue(result.success);
      assert.isNotNull(result.output);
      assert.instanceOf(result.output, Temporal.PlainTime);
      expect(aZonedDateTime.toPlainTime().equals(result.output)).toBeTruthy();
    });

    test('converts a valid Dayjs to Temporal.PlainTime', () => {
      const result = v.safeParse(schema, validDayjs);
      assert.isTrue(result.success);
      assert.isNotNull(result.output);
      assert.instanceOf(result.output, Temporal.PlainTime);
      expect(aPlainTime.equals(result.output)).toBeTruthy();
    });

    test('passes extra plain time actions', () => {
      const minTime = Temporal.PlainTime.from('08:00:00');
      const schemaWithAction = plainTime(
        wrongTypeMessages,
        v.check((val) => Temporal.PlainTime.compare(val, minTime) >= 0, 'too early'),
      );
      const failResult = v.safeParse(schemaWithAction, Temporal.PlainTime.from('07:59:59'));
      expect(failResult.success).toBeFalsy();
      const passResult = v.safeParse(schemaWithAction, minTime);
      expect(passResult.success).toBeTruthy();
    });

    describe('should return dataset with issues', () => {
      test('rejects an invalid Dayjs', () => {
        const result = v.safeParse(schema, invalidDayjs);
        expect(result.success).toBeFalsy();
      });

      test('rejects strings', () => {
        const result = v.safeParse(schema, '09:30:00');
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
    const schema = plainTime(requiredMessages);

    test('passes a Temporal.PlainTime', () => {
      const result = v.safeParse(schema, aPlainTime);
      assert.isTrue(result.success);
      assert.isNotNull(result.output);
      assert.instanceOf(result.output, Temporal.PlainTime);
      expect(aPlainTime.equals(result.output)).toBeTruthy();
    });

    test('converts a Temporal.PlainDateTime to Temporal.PlainTime', () => {
      const result = v.safeParse(schema, aPlainDateTime);
      assert.isTrue(result.success);
      assert.isNotNull(result.output);
      assert.instanceOf(result.output, Temporal.PlainTime);
      expect(aPlainDateTime.toPlainTime().equals(result.output)).toBeTruthy();
    });

    test('converts a Temporal.ZonedDateTime to Temporal.PlainTime', () => {
      const result = v.safeParse(schema, aZonedDateTime);
      assert.isTrue(result.success);
      assert.isNotNull(result.output);
      assert.instanceOf(result.output, Temporal.PlainTime);
      expect(aZonedDateTime.toPlainTime().equals(result.output)).toBeTruthy();
    });

    test('converts a valid Dayjs to Temporal.PlainTime', () => {
      const result = v.safeParse(schema, validDayjs);
      assert.isTrue(result.success);
      assert.isNotNull(result.output);
      assert.instanceOf(result.output, Temporal.PlainTime);
      expect(aPlainTime.equals(result.output)).toBeTruthy();
    });

    test('passes extra plain time actions', () => {
      const minTime = Temporal.PlainTime.from('08:00:00');
      const schemaWithAction = plainTime(
        requiredMessages,
        v.check((val) => Temporal.PlainTime.compare(val, minTime) >= 0, 'too early'),
      );
      const failResult = v.safeParse(schemaWithAction, Temporal.PlainTime.from('07:59:59'));
      expect(failResult.success).toBeFalsy();
      const passResult = v.safeParse(schemaWithAction, minTime);
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
        const result = v.safeParse(schema, '09:30:00');
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
