import * as v from 'valibot';
import { assert, describe, expect, test } from 'vite-plus/test';

import { isDayJSValid } from '#src/actions/is-dayjs-valid';
import { dayJS } from '#src/dayjs.config';
import { dayjs } from '#src/schemas/dayjs';

const validDayjs = dayJS.utc('2024-06-15T12:00:00Z');
const invalidDayjs = dayJS('not a date');

describe('isDayJSValid', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      expect(isDayJSValid()).toStrictEqual({
        kind: 'validation',
        type: 'is_dayjs_valid',
        reference: isDayJSValid,
        async: false,
        message: undefined,
        expects: null,
        '~run': expect.any(Function),
      });
    });

    test('with string message', () => {
      expect(isDayJSValid('message')).toStrictEqual({
        kind: 'validation',
        type: 'is_dayjs_valid',
        reference: isDayJSValid,
        async: false,
        message: 'message',
        expects: null,
        '~run': expect.any(Function),
      });
    });
  });

  describe('validation behavior', () => {
    const schema = v.pipe(dayjs(), isDayJSValid('Invalid date'));

    test('passes a valid Dayjs', () => {
      const result = v.safeParse(schema, validDayjs);
      assert.isTrue(result.success);
      assert.isTrue(dayJS.isDayjs(result.output));
      expect(result.output).toStrictEqual(validDayjs);
    });

    test('rejects an invalid Dayjs', () => {
      const result = v.safeParse(schema, invalidDayjs);
      expect(result.success).toBeFalsy();
    });
  });
});
