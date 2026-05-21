import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { assert, describe, expect, test } from 'vite-plus/test';

import { plainDateTime } from '#src/valibot/schema/plain-date-time';

describe('plainDateTime', () => {
  describe('should return dataset without issues', () => {
    test('for a Temporal.PlainDateTime object', () => {
      const value = Temporal.PlainDateTime.from('2024-06-15T10:30:00');
      const result = v.safeParse(plainDateTime, value);
      assert.isTrue(result.success);
      expect(result.output.equals(value)).toBeTruthy();
    });

    test('for a plain date-time ISO string', () => {
      const value = '2024-06-15T10:30:00';
      const result = v.safeParse(plainDateTime, value);
      assert.isTrue(result.success);
      expect(result.output.equals(Temporal.PlainDateTime.from(value))).toBeTruthy();
    });

    test('for a plain date-time with sub-seconds', () => {
      const value = '2024-06-15T23:59:59.999';
      const result = v.safeParse(plainDateTime, value);
      assert.isTrue(result.success);
      expect(result.output.equals(Temporal.PlainDateTime.from(value))).toBeTruthy();
    });
  });

  describe('should return dataset with issues', () => {
    test('for null', () => {
      const value = null;
      const result = v.safeParse(plainDateTime, value);
      expect(result.success).toBeFalsy();
    });

    test('for undefined', () => {
      const value = undefined;
      const result = v.safeParse(plainDateTime, value);
      expect(result.success).toBeFalsy();
    });

    test('for an invalid string', () => {
      const value = 'not-a-datetime';
      const result = v.safeParse(plainDateTime, value);
      expect(result.success).toBeFalsy();
    });

    test('string needing a trim', () => {
      const value = '  2024-06-15T10:30:00  ';
      const result = v.safeParse(plainDateTime, value);
      expect(result.success).toBeFalsy();
    });

    test('for a number', () => {
      const value = 20_240_615;
      const result = v.safeParse(plainDateTime, value);
      expect(result.success).toBeFalsy();
    });

    test('for a Temporal.PlainDate', () => {
      const value = Temporal.PlainDate.from('2024-01-01');
      const result = v.safeParse(plainDateTime, value);
      expect(result.success).toBeFalsy();
    });

    test('for a Temporal.Instant', () => {
      const value = Temporal.Instant.fromEpochMilliseconds(0);
      const result = v.safeParse(plainDateTime, value);
      expect(result.success).toBeFalsy();
    });

    test('for a Temporal.ZonedDateTime', () => {
      const value = Temporal.ZonedDateTime.from('2024-01-01T00:00:00+00:00[UTC]');
      const result = v.safeParse(plainDateTime, value);
      expect(result.success).toBeFalsy();
    });
  });
});
