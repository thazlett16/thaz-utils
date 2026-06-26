import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { assert, describe, expect, test } from 'vite-plus/test';

import { dayJS } from '#src/dayjs.config';
import { dayjs } from '#src/schemas/dayjs';

const validDayjs = dayJS.utc('2024-06-15T12:00:00Z');
const invalidDayjs = dayJS('not a date');

describe('dayjs schema', () => {
  test('can be created without a message', () => {
    const schema = dayjs();
    const result = v.safeParse(schema, validDayjs);
    assert.isTrue(result.success);
    assert.isTrue(dayJS.isDayjs(result.output));
    expect(result.output).toStrictEqual(validDayjs);
  });

  describe('with a message', () => {
    const schema = dayjs('Wrong type');

    test('passes a valid Dayjs', () => {
      const result = v.safeParse(schema, validDayjs);
      assert.isTrue(result.success);
      assert.isTrue(dayJS.isDayjs(result.output));
      expect(result.output).toStrictEqual(validDayjs);
    });

    test('passes an invalid Dayjs (type check only, not validity)', () => {
      const result = v.safeParse(schema, invalidDayjs);
      assert.isTrue(result.success);
      assert.isTrue(dayJS.isDayjs(result.output));
      expect(result.output).toStrictEqual(invalidDayjs);
    });

    test('exposes Standard Schema interface via ~standard getter', () => {
      expect(schema['~standard']).toBeDefined();
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

      test('rejects a string with the given message', () => {
        const result = v.safeParse(schema, '2024-06-15');
        expect(result.success).toBeFalsy();
      });

      test('rejects a number', () => {
        const result = v.safeParse(schema, 0);
        expect(result.success).toBeFalsy();
      });

      test('rejects a plain object', () => {
        const result = v.safeParse(schema, {});
        expect(result.success).toBeFalsy();
      });

      test('rejects a Temporal.Instant', () => {
        const result = v.safeParse(schema, Temporal.Instant.from('2024-06-15T12:00:00Z'));
        expect(result.success).toBeFalsy();
      });

      test('rejects a Temporal.ZonedDateTime', () => {
        const result = v.safeParse(schema, Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]'));
        expect(result.success).toBeFalsy();
      });
    });
  });
});
