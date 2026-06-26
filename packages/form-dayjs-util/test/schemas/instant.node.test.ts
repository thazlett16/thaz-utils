import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { assert, describe, expect, test } from 'vite-plus/test';

import { dayJS } from '#src/dayjs.config';
import { instant } from '#src/schemas/instant';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

const anInstant = Temporal.Instant.from('2024-06-15T12:00:00Z');
const aZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
const validDayjs = dayJS.utc('2024-06-15T12:00:00Z');
const invalidDayjs = dayJS('not a date');

describe('instant', () => {
  describe('nullable overload', () => {
    const schema = instant(wrongTypeMessages);

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

    test('passes a Temporal.Instant', () => {
      const result = v.safeParse(schema, anInstant);
      assert.isTrue(result.success);
      assert.isNotNull(result.output);
      assert.instanceOf(result.output, Temporal.Instant);
      expect(anInstant.equals(result.output)).toBeTruthy();
    });

    test('converts a Temporal.ZonedDateTime to Temporal.Instant', () => {
      const result = v.safeParse(schema, aZonedDateTime);
      assert.isTrue(result.success);
      assert.isNotNull(result.output);
      assert.instanceOf(result.output, Temporal.Instant);
      expect(aZonedDateTime.toInstant().equals(result.output)).toBeTruthy();
    });

    test('converts a valid Dayjs to Temporal.Instant', () => {
      const result = v.safeParse(schema, validDayjs);
      assert.isTrue(result.success);
      assert.isNotNull(result.output);
      assert.instanceOf(result.output, Temporal.Instant);
      expect(anInstant.equals(result.output)).toBeTruthy();
    });

    test('passes extra instant actions', () => {
      const minInstant = Temporal.Instant.from('2024-01-01T00:00:00Z');
      const schemaWithAction = instant(
        wrongTypeMessages,
        v.check((val) => Temporal.Instant.compare(val, minInstant) >= 0, 'too early'),
      );
      const failResult = v.safeParse(schemaWithAction, Temporal.Instant.from('2023-12-31T23:59:59Z'));
      expect(failResult.success).toBeFalsy();
      const passResult = v.safeParse(schemaWithAction, minInstant);
      expect(passResult.success).toBeTruthy();
    });

    describe('should return dataset with issues', () => {
      test('rejects an invalid Dayjs', () => {
        const result = v.safeParse(schema, invalidDayjs);
        expect(result.success).toBeFalsy();
      });

      test('rejects strings', () => {
        const result = v.safeParse(schema, '2024-06-15T12:00:00Z');
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

      test('rejects Temporal.PlainDate', () => {
        const result = v.safeParse(schema, Temporal.PlainDate.from('2024-06-15'));
        expect(result.success).toBeFalsy();
      });
    });
  });

  describe('required overload', () => {
    const schema = instant(requiredMessages);

    test('passes a Temporal.Instant', () => {
      const result = v.safeParse(schema, anInstant);
      assert.isTrue(result.success);
      assert.isNotNull(result.output);
      assert.instanceOf(result.output, Temporal.Instant);
      expect(anInstant.equals(result.output)).toBeTruthy();
    });

    test('converts a Temporal.ZonedDateTime to Temporal.Instant', () => {
      const result = v.safeParse(schema, aZonedDateTime);
      assert.isTrue(result.success);
      assert.isNotNull(result.output);
      assert.instanceOf(result.output, Temporal.Instant);
      expect(aZonedDateTime.toInstant().equals(result.output)).toBeTruthy();
    });

    test('converts a valid Dayjs to Temporal.Instant', () => {
      const result = v.safeParse(schema, validDayjs);
      assert.isTrue(result.success);
      assert.isNotNull(result.output);
      assert.instanceOf(result.output, Temporal.Instant);
      expect(anInstant.equals(result.output)).toBeTruthy();
    });

    test('passes extra instant actions', () => {
      const minInstant = Temporal.Instant.from('2024-01-01T00:00:00Z');
      const schemaWithAction = instant(
        requiredMessages,
        v.check((val) => Temporal.Instant.compare(val, minInstant) >= 0, 'too early'),
      );
      const failResult = v.safeParse(schemaWithAction, Temporal.Instant.from('2023-12-31T23:59:59Z'));
      expect(failResult.success).toBeFalsy();
      const passResult = v.safeParse(schemaWithAction, minInstant);
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
        const result = v.safeParse(schema, '2024-06-15T12:00:00Z');
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

      test('rejects Temporal.PlainDate', () => {
        const result = v.safeParse(schema, Temporal.PlainDate.from('2024-06-15'));
        expect(result.success).toBeFalsy();
      });
    });
  });
});
