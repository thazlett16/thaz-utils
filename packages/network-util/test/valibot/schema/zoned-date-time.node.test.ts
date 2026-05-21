import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { assert, describe, expect, test } from 'vite-plus/test';

import { zonedDateTime } from '#src/valibot/schema/zoned-date-time';

describe('zonedDateTime', () => {
  describe('should return dataset without issues', () => {
    test('for a Temporal.ZonedDateTime object', () => {
      const value = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
      const result = v.safeParse(zonedDateTime, value);
      assert.isTrue(result.success);
      expect(result.output.equals(value)).toBeTruthy();
    });

    test('for a ZonedDateTime ISO string', () => {
      const value = '2024-06-15T12:00:00+00:00[UTC]';
      const result = v.safeParse(zonedDateTime, value);
      assert.isTrue(result.success);
      expect(result.output.equals(Temporal.ZonedDateTime.from(value))).toBeTruthy();
    });
  });

  describe('should return dataset with issues', () => {
    test('for null', () => {
      const value = null;
      const result = v.safeParse(zonedDateTime, value);
      expect(result.success).toBeFalsy();
    });

    test('for undefined', () => {
      const value = undefined;
      const result = v.safeParse(zonedDateTime, value);
      expect(result.success).toBeFalsy();
    });

    test('for a plain date string (no timezone)', () => {
      const value = '2024-01-01';
      const result = v.safeParse(zonedDateTime, value);
      expect(result.success).toBeFalsy();
    });

    test('for an instant string (no timezone id)', () => {
      const value = '2024-01-01T00:00:00Z';
      const result = v.safeParse(zonedDateTime, value);
      expect(result.success).toBeFalsy();
    });

    test('for an invalid string', () => {
      const value = 'not-a-date';
      const result = v.safeParse(zonedDateTime, value);
      expect(result.success).toBeFalsy();
    });

    test('string needing a trim', () => {
      const value = '  2024-01-01T00:00:00+00:00[UTC]  ';
      const result = v.safeParse(zonedDateTime, value);
      expect(result.success).toBeFalsy();
    });

    test('for a Temporal.Instant', () => {
      const value = Temporal.Instant.fromEpochMilliseconds(0);
      const result = v.safeParse(zonedDateTime, value);
      expect(result.success).toBeFalsy();
    });
  });
});
