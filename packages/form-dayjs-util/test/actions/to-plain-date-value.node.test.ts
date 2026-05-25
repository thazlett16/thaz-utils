import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { assert, describe, expect, test } from 'vite-plus/test';

import { toPlainDate } from '#src/actions/to-plain-date-value';
import { dayJS } from '#src/dayjs.config';

const validDayjs = dayJS.utc('2024-06-15T09:30:00Z');
const invalidDayjs = dayJS.utc('not a date');
const aPlainDate = Temporal.PlainDate.from('2024-06-15');

describe('toPlainDate', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      expect(toPlainDate()).toStrictEqual({
        kind: 'transformation',
        type: 'to_plain_date',
        reference: toPlainDate,
        async: false,
        message: undefined,
        '~run': expect.any(Function),
      });
    });

    test('with string message', () => {
      expect(toPlainDate('message')).toStrictEqual({
        kind: 'transformation',
        type: 'to_plain_date',
        reference: toPlainDate,
        async: false,
        message: 'message',
        '~run': expect.any(Function),
      });
    });
  });

  describe('should transform to Temporal.PlainDate', () => {
    const schema = v.pipe(v.any(), toPlainDate());

    test('converts a Dayjs using year/month/day components', () => {
      const result = v.safeParse(schema, validDayjs);
      assert.isTrue(result.success);
      assert.instanceOf(result.output, Temporal.PlainDate);
      expect(result.output.year).toBe(2024);
      expect(result.output.month).toBe(6);
      expect(result.output.day).toBe(15);
    });

    test('passes through an existing Temporal.PlainDate', () => {
      const result = v.safeParse(schema, aPlainDate);
      assert.isTrue(result.success);
      assert.instanceOf(result.output, Temporal.PlainDate);
      expect(result.output.year).toBe(2024);
      expect(result.output.month).toBe(6);
      expect(result.output.day).toBe(15);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = v.pipe(v.any(), toPlainDate());

    test('for invalid dayjs', () => {
      const result = v.safeParse(schema, invalidDayjs);
      expect(result.success).toBeFalsy();
    });

    test('for null', () => {
      const result = v.safeParse(schema, null);
      expect(result.success).toBeFalsy();
    });

    test('for a string', () => {
      const result = v.safeParse(schema, '2024-06-15');
      expect(result.success).toBeFalsy();
    });

    test('for a plain object', () => {
      const result = v.safeParse(schema, {});
      expect(result.success).toBeFalsy();
    });

    test('for a Temporal.Instant', () => {
      const result = v.safeParse(schema, Temporal.Instant.from('2024-06-15T00:00:00Z'));
      expect(result.success).toBeFalsy();
    });
  });
});
