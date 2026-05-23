import { Temporal } from '@js-temporal/polyfill';
import { assert, describe, expect, test } from 'vite-plus/test';

import type { ToInstantAction } from '#src/actions/to-instant-value';
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
      } satisfies ToInstantAction<unknown, undefined>);
    });

    test('with string message', () => {
      expect(toInstant('message')).toStrictEqual({
        kind: 'transformation',
        type: 'to_instant',
        reference: toInstant,
        async: false,
        message: 'message',
        '~run': expect.any(Function),
      } satisfies ToInstantAction<unknown, string>);
    });
  });

  describe('should transform to Temporal.Instant', () => {
    const action = toInstant();

    test('converts a valid Dayjs via ISO string', () => {
      const result = action['~run']({ typed: true, value: validDayjs }, {});
      assert.isTrue(result.typed);
      assert.instanceOf(result.value, Temporal.Instant);
      expect(anInstant.equals(result.value)).toBeTruthy();
    });

    test('passes through an existing Temporal.Instant', () => {
      const result = action['~run']({ typed: true, value: anInstant }, {});
      assert.isTrue(result.typed);
      expect(result.value.equals(anInstant)).toBeTruthy();
    });
  });

  describe('should return dataset with issues', () => {
    const action = toInstant('error');

    test('for invalid dayjs', () => {
      const result = action['~run']({ typed: true, value: invalidDayjs }, {});
      expect(result.typed).toBeFalsy();
    });

    test('for null', () => {
      const result = action['~run']({ typed: true, value: null }, {});
      expect(result.typed).toBeFalsy();
    });

    test('for a string', () => {
      const result = action['~run']({ typed: true, value: 'not-an-instant' }, {});
      expect(result.typed).toBeFalsy();
    });

    test('for a plain object', () => {
      const result = action['~run']({ typed: true, value: {} }, {});
      expect(result.typed).toBeFalsy();
    });

    test('for a Temporal.PlainDate', () => {
      const result = action['~run']({ typed: true, value: Temporal.PlainDate.from('2024-06-15') }, {});
      expect(result.typed).toBeFalsy();
    });
  });
});
