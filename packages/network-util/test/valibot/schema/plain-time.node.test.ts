import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { assert, describe, expect, test } from 'vite-plus/test';

import { plainTime } from '#src/valibot/schema/plain-time';

describe('plainTime', () => {
  describe('should return dataset without issues', () => {
    test('for a Temporal.PlainTime object', () => {
      const value = Temporal.PlainTime.from('10:30:00');
      const result = v.safeParse(plainTime, value);
      assert(result.success);
      expect(result.output.equals(value)).toBeTruthy();
    });

    test('for a plain time ISO string', () => {
      const value = '10:30:00';
      const result = v.safeParse(plainTime, value);
      assert(result.success);
      expect(result.output.equals(Temporal.PlainTime.from(value))).toBeTruthy();
    });
  });

  describe('should return dataset with issues', () => {
    test('for null', () => {
      const value = null;
      const result = v.safeParse(plainTime, value);
      expect(result.success).toBeFalsy();
    });

    test('for undefined', () => {
      const value = undefined;
      const result = v.safeParse(plainTime, value);
      expect(result.success).toBeFalsy();
    });

    test('for an invalid string', () => {
      const value = 'not-a-time';
      const result = v.safeParse(plainTime, value);
      expect(result.success).toBeFalsy();
    });

    test('string needing a trim', () => {
      const value = '  12:00:00  ';
      const result = v.safeParse(plainTime, value);
      expect(result.success).toBeFalsy();
    });

    test('for a number', () => {
      const value = 1030;
      const result = v.safeParse(plainTime, value);
      expect(result.success).toBeFalsy();
    });

    test('for a Temporal.PlainDate', () => {
      const value = Temporal.PlainDate.from('2024-01-01');
      const result = v.safeParse(plainTime, value);
      expect(result.success).toBeFalsy();
    });
  });
});
