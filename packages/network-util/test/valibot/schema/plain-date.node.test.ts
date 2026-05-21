import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { assert, describe, expect, test } from 'vite-plus/test';

import { plainDate } from '#src/valibot/schema/plain-date';

describe('plainDate', () => {
  describe('should return dataset without issues', () => {
    test('for a Temporal.PlainDate object', () => {
      const value = Temporal.PlainDate.from('2024-06-15');
      const result = v.safeParse(plainDate, value);
      assert.isTrue(result.success);
      expect(result.output.equals(value)).toBeTruthy();
    });

    test('for a plain date ISO string', () => {
      const value = '2024-06-15';
      const result = v.safeParse(plainDate, value);
      assert.isTrue(result.success);
      expect(result.output.equals(Temporal.PlainDate.from(value))).toBeTruthy();
    });
  });

  describe('should return dataset with issues', () => {
    test('for null', () => {
      const value = null;
      const result = v.safeParse(plainDate, value);
      expect(result.success).toBeFalsy();
    });

    test('for undefined', () => {
      const value = undefined;
      const result = v.safeParse(plainDate, value);
      expect(result.success).toBeFalsy();
    });

    test('for an invalid string', () => {
      const value = 'not-a-date';
      const result = v.safeParse(plainDate, value);
      expect(result.success).toBeFalsy();
    });

    test('string needing a trim', () => {
      const value = '  2024-01-01  ';
      const result = v.safeParse(plainDate, value);
      expect(result.success).toBeFalsy();
    });

    test('for a number', () => {
      const value = 20_240_615;
      const result = v.safeParse(plainDate, value);
      expect(result.success).toBeFalsy();
    });

    test('for a Temporal.Instant', () => {
      const value = Temporal.Instant.fromEpochMilliseconds(0);
      const result = v.safeParse(plainDate, value);
      expect(result.success).toBeFalsy();
    });
  });
});
