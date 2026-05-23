import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { assert, describe, expect, test } from 'vite-plus/test';

import { toInstant } from '#src/actions/to-instant-value';
import { dayJS } from '#src/dayjs.config';

const validDayjs = dayJS.utc('2024-06-15T12:00:00Z');
const invalidDayjs = dayJS.utc('not a date');
const anInstant = Temporal.Instant.from('2024-06-15T12:00:00Z');

describe('toInstant', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      expect(toInstant()).toStrictEqual({
        kind: 'transformation',
        type: 'to_instant',
        reference: toInstant,
        async: false,
        message: undefined,
        '~run': expect.any(Function),
      });
    });

    test('with string message', () => {
      expect(toInstant('message')).toStrictEqual({
        kind: 'transformation',
        type: 'to_instant',
        reference: toInstant,
        async: false,
        message: 'message',
        '~run': expect.any(Function),
      });
    });
  });

  describe('should transform to Temporal.Instant', () => {
    const schema = v.pipe(v.any(), toInstant());

    test('converts a valid Dayjs via ISO string', () => {
      const result = v.safeParse(schema, validDayjs);
      assert.isTrue(result.success);
      assert.instanceOf(result.output, Temporal.Instant);
      expect(anInstant.equals(result.output)).toBeTruthy();
    });

    test('passes through an existing Temporal.Instant', () => {
      const result = v.safeParse(schema, anInstant);
      assert.isTrue(result.success);
      assert.instanceOf(result.output, Temporal.Instant);
      expect(anInstant.equals(result.output)).toBeTruthy();
    });
  });

  describe('should return dataset with issues', () => {
    const schema = v.pipe(v.any(), toInstant('error'));

    test('for invalid dayjs', () => {
      const result = v.safeParse(schema, invalidDayjs);
      expect(result.success).toBeFalsy();
    });

    test('for null', () => {
      const result = v.safeParse(schema, null);
      expect(result.success).toBeFalsy();
    });

    test('for a string', () => {
      const result = v.safeParse(schema, 'not-an-instant');
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
