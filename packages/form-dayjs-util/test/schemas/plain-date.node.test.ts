import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { assert, describe, expect, test } from 'vite-plus/test';

import { dayJS } from '#src/dayjs.config';
import { plainDate } from '#src/schemas/plain-date';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

const aPlainDate = Temporal.PlainDate.from('2024-06-15');
const aZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
const aPlainDateTime = Temporal.PlainDateTime.from('2024-06-15T12:00:00');
const validDayjs = dayJS.utc('2024-06-15T12:00:00Z');
const invalidDayjs = dayJS('not a date');

describe('plainDate', () => {
  describe('nullable overload', () => {
    const schema = plainDate(wrongTypeMessages);

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

    test('passes a Temporal.PlainDate', () => {
      const result = v.safeParse(schema, aPlainDate);
      assert.isTrue(result.success);
      assert.isNotNull(result.output);
      assert.instanceOf(result.output, Temporal.PlainDate);
      expect(aPlainDate.equals(result.output)).toBeTruthy();
    });

    test('converts a Temporal.PlainDateTime to Temporal.PlainDate', () => {
      const result = v.safeParse(schema, aPlainDateTime);
      assert.isTrue(result.success);
      assert.isNotNull(result.output);
      assert.instanceOf(result.output, Temporal.PlainDate);
      expect(aPlainDateTime.toPlainDate().equals(result.output)).toBeTruthy();
    });

    test('converts a Temporal.ZonedDateTime to Temporal.PlainDate', () => {
      const result = v.safeParse(schema, aZonedDateTime);
      assert.isTrue(result.success);
      assert.isNotNull(result.output);
      assert.instanceOf(result.output, Temporal.PlainDate);
      expect(aZonedDateTime.toPlainDate().equals(result.output)).toBeTruthy();
    });

    test('converts a valid Dayjs to Temporal.PlainDate', () => {
      const result = v.safeParse(schema, validDayjs);
      assert.isTrue(result.success);
      assert.isNotNull(result.output);
      assert.instanceOf(result.output, Temporal.PlainDate);
      expect(aPlainDate.equals(result.output)).toBeTruthy();
    });

    test('passes extra plain date actions', () => {
      const minDate = Temporal.PlainDate.from('2024-01-01');
      const schemaWithAction = plainDate(
        wrongTypeMessages,
        v.check((val) => Temporal.PlainDate.compare(val, minDate) >= 0, 'too early'),
      );
      const failResult = v.safeParse(schemaWithAction, Temporal.PlainDate.from('2023-12-31'));
      expect(failResult.success).toBeFalsy();
      const passResult = v.safeParse(schemaWithAction, minDate);
      expect(passResult.success).toBeTruthy();
    });

    describe('should return dataset with issues', () => {
      test('rejects an invalid Dayjs', () => {
        const result = v.safeParse(schema, invalidDayjs);
        expect(result.success).toBeFalsy();
      });

      test('rejects strings', () => {
        const result = v.safeParse(schema, '2024-06-15');
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
    const schema = plainDate(requiredMessages);

    test('passes a Temporal.PlainDate', () => {
      const result = v.safeParse(schema, aPlainDate);
      assert.isTrue(result.success);
      assert.isNotNull(result.output);
      assert.instanceOf(result.output, Temporal.PlainDate);
      expect(aPlainDate.equals(result.output)).toBeTruthy();
    });

    test('converts a Temporal.PlainDateTime to Temporal.PlainDate', () => {
      const result = v.safeParse(schema, aPlainDateTime);
      assert.isTrue(result.success);
      assert.isNotNull(result.output);
      assert.instanceOf(result.output, Temporal.PlainDate);
      expect(aPlainDateTime.toPlainDate().equals(result.output)).toBeTruthy();
    });

    test('converts a Temporal.ZonedDateTime to Temporal.PlainDate', () => {
      const result = v.safeParse(schema, aZonedDateTime);
      assert.isTrue(result.success);
      assert.isNotNull(result.output);
      assert.instanceOf(result.output, Temporal.PlainDate);
      expect(aZonedDateTime.toPlainDate().equals(result.output)).toBeTruthy();
    });

    test('converts a valid Dayjs to Temporal.PlainDate', () => {
      const result = v.safeParse(schema, validDayjs);
      assert.isTrue(result.success);
      assert.isNotNull(result.output);
      assert.instanceOf(result.output, Temporal.PlainDate);
      expect(aPlainDate.equals(result.output)).toBeTruthy();
    });

    test('passes extra plain date actions', () => {
      const minDate = Temporal.PlainDate.from('2024-01-01');
      const schemaWithAction = plainDate(
        requiredMessages,
        v.check((val) => Temporal.PlainDate.compare(val, minDate) >= 0, 'too early'),
      );
      const failResult = v.safeParse(schemaWithAction, Temporal.PlainDate.from('2023-12-31'));
      expect(failResult.success).toBeFalsy();
      const passResult = v.safeParse(schemaWithAction, minDate);
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
        const result = v.safeParse(schema, '2024-06-15');
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
