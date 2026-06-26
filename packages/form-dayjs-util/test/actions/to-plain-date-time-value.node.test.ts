import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { assert, describe, expect, test } from 'vite-plus/test';

import { toPlainDateTime } from '#src/actions/to-plain-date-time-value';
import { dayJS } from '#src/dayjs.config';

const validDayjs = dayJS({ years: 2024, months: 5, dates: 15, hours: 9, minutes: 30, seconds: 45, milliseconds: 100 });
const invalidDayjs = dayJS.utc('not a date');
const aPlainDateTime = Temporal.PlainDateTime.from('2024-06-15T09:30:45.1');

describe('toPlainDateTime', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      expect(toPlainDateTime()).toStrictEqual({
        kind: 'transformation',
        type: 'to_plain_date_time',
        reference: toPlainDateTime,
        async: false,
        message: undefined,
        '~run': expect.any(Function),
      });
    });

    test('with string message', () => {
      expect(toPlainDateTime('message')).toStrictEqual({
        kind: 'transformation',
        type: 'to_plain_date_time',
        reference: toPlainDateTime,
        async: false,
        message: 'message',
        '~run': expect.any(Function),
      });
    });
  });

  describe('should transform to Temporal.PlainDateTime', () => {
    const schema = v.pipe(v.any(), toPlainDateTime());

    test('converts a Dayjs using all date/time components', () => {
      const result = v.safeParse(schema, validDayjs);
      assert.isTrue(result.success);
      assert.instanceOf(result.output, Temporal.PlainDateTime);
      expect(result.output.year).toBe(2024);
      expect(result.output.month).toBe(6);
      expect(result.output.day).toBe(15);
      expect(result.output.hour).toBe(9);
      expect(result.output.minute).toBe(30);
      expect(result.output.second).toBe(45);
      expect(result.output.millisecond).toBe(100);
    });

    test('passes through an existing Temporal.PlainDateTime', () => {
      const result = v.safeParse(schema, aPlainDateTime);
      assert.isTrue(result.success);
      assert.instanceOf(result.output, Temporal.PlainDateTime);
      expect(aPlainDateTime.equals(result.output)).toBeTruthy();
    });
  });

  describe('should return dataset with issues', () => {
    const schema = v.pipe(v.any(), toPlainDateTime());

    test('for invalid dayjs', () => {
      const result = v.safeParse(schema, invalidDayjs);
      expect(result.success).toBeFalsy();
    });

    test('for null', () => {
      const result = v.safeParse(schema, null);
      expect(result.success).toBeFalsy();
    });

    test('for a string', () => {
      const result = v.safeParse(schema, '2024-06-15T09:30:00');
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
