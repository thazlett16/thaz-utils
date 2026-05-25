import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { assert, describe, expect, test } from 'vite-plus/test';

import { toPlainTime } from '#src/actions/to-plain-time-value';
import { dayJS } from '#src/dayjs.config';

const validDayjs = dayJS({ hours: 9, minutes: 30, seconds: 45, milliseconds: 100 });
const invalidDayjs = dayJS.utc('not a date');
const aPlainTime = Temporal.PlainTime.from('09:30:45.1');

describe('toPlainTime', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      expect(toPlainTime()).toStrictEqual({
        kind: 'transformation',
        type: 'to_plain_time',
        reference: toPlainTime,
        async: false,
        message: undefined,
        '~run': expect.any(Function),
      });
    });

    test('with string message', () => {
      expect(toPlainTime('message')).toStrictEqual({
        kind: 'transformation',
        type: 'to_plain_time',
        reference: toPlainTime,
        async: false,
        message: 'message',
        '~run': expect.any(Function),
      });
    });
  });

  describe('should transform to Temporal.PlainTime', () => {
    const schema = v.pipe(v.any(), toPlainTime());

    test('converts a Dayjs using hour/minute/second/millisecond components', () => {
      const result = v.safeParse(schema, validDayjs);
      assert.isTrue(result.success);
      assert.instanceOf(result.output, Temporal.PlainTime);
      expect(result.output.hour).toBe(9);
      expect(result.output.minute).toBe(30);
      expect(result.output.second).toBe(45);
      expect(result.output.millisecond).toBe(100);
    });

    test('passes through an existing Temporal.PlainTime', () => {
      const result = v.safeParse(schema, aPlainTime);
      assert.isTrue(result.success);
      assert.instanceOf(result.output, Temporal.PlainTime);
      expect(result.output.hour).toBe(9);
      expect(result.output.minute).toBe(30);
      expect(result.output.second).toBe(45);
      expect(result.output.millisecond).toBe(100);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = v.pipe(v.any(), toPlainTime());

    test('for invalid dayjs', () => {
      const result = v.safeParse(schema, invalidDayjs);
      expect(result.success).toBeFalsy();
    });

    test('for null', () => {
      const result = v.safeParse(schema, null);
      expect(result.success).toBeFalsy();
    });

    test('for a string', () => {
      const result = v.safeParse(schema, '09:30:45.1');
      expect(result.success).toBeFalsy();
    });

    test('for a plain object', () => {
      const result = v.safeParse(schema, {});
      expect(result.success).toBeFalsy();
    });

    test('for a Temporal.PlainDate', () => {
      const result = v.safeParse(schema, Temporal.PlainDate.from('2024-06-15'));
      expect(result.success).toBeFalsy();
    });
  });
});
