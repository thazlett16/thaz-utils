import type { ZonedDateTime } from '@internationalized/date';
import { parseZonedDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import type {
  ToInternationalizedZonedDateTimeAction,
  ToInternationalizedZonedDateTimeIssue,
} from '#src/actions/to-internationalized-zoned-date-time-value';
import { toInternationalizedZonedDateTime } from '#src/actions/to-internationalized-zoned-date-time-value';

describe('toInternationalizedZonedDateTime', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      expect(toInternationalizedZonedDateTime()).toStrictEqual({
        kind: 'transformation',
        type: 'to_zoned_date_time',
        reference: toInternationalizedZonedDateTime,
        async: false,
        message: undefined,
        '~run': expect.any(Function),
      } satisfies ToInternationalizedZonedDateTimeAction<unknown, undefined>);
    });

    test('with string message', () => {
      expect(toInternationalizedZonedDateTime('message')).toStrictEqual({
        kind: 'transformation',
        type: 'to_zoned_date_time',
        reference: toInternationalizedZonedDateTime,
        async: false,
        message: 'message',
        '~run': expect.any(Function),
      } satisfies ToInternationalizedZonedDateTimeAction<unknown, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(toInternationalizedZonedDateTime(message)).toStrictEqual({
        kind: 'transformation',
        type: 'to_zoned_date_time',
        reference: toInternationalizedZonedDateTime,
        async: false,
        message,
        '~run': expect.any(Function),
      } satisfies ToInternationalizedZonedDateTimeAction<unknown, typeof message>);
    });
  });

  describe('should convert zoned datetime strings to @internationalized/date ZonedDateTime', () => {
    const action = toInternationalizedZonedDateTime();

    test('converts a UTC zoned datetime string', () => {
      const result = action['~run']({ typed: true, value: '2024-06-15T12:00:00+00:00[UTC]' }, {});
      expect(result.typed).toBeTruthy();
      const zdt = result.value as ZonedDateTime;
      expect(zdt.timeZone).toBe('UTC');
      expect(zdt.year).toBe(2024);
      expect(zdt.month).toBe(6);
      expect(zdt.day).toBe(15);
      expect(zdt.hour).toBe(12);
    });

    test('converts a CDT zoned datetime string', () => {
      const result = action['~run']({ typed: true, value: '2024-06-15T12:00:00-05:00[America/Chicago]' }, {});
      expect(result.typed).toBeTruthy();
      const zdt = result.value as ZonedDateTime;
      expect(zdt.timeZone).toBe('America/Chicago');
      expect(zdt.hour).toBe(12);
      expect(zdt.offset).toBe(-5 * 3600 * 1000);
    });

    test('converts a CST zoned datetime string', () => {
      const result = action['~run']({ typed: true, value: '2024-01-15T12:00:00-06:00[America/Chicago]' }, {});
      expect(result.typed).toBeTruthy();
      const zdt = result.value as ZonedDateTime;
      expect(zdt.timeZone).toBe('America/Chicago');
      expect(zdt.hour).toBe(12);
      expect(zdt.offset).toBe(-6 * 3600 * 1000);
    });

    test('converts a string for DST fall-back (first 01:30 CDT, UTC-5)', () => {
      const result = action['~run']({ typed: true, value: '2024-11-03T01:30:00-05:00[America/Chicago]' }, {});
      expect(result.typed).toBeTruthy();
      const zdt = result.value as ZonedDateTime;
      expect(zdt.hour).toBe(1);
      expect(zdt.minute).toBe(30);
      expect(zdt.offset).toBe(-5 * 3600 * 1000);
    });

    test('converts a string for DST fall-back (second 01:30 CST, UTC-6)', () => {
      const result = action['~run']({ typed: true, value: '2024-11-03T01:30:00-06:00[America/Chicago]' }, {});
      expect(result.typed).toBeTruthy();
      const zdt = result.value as ZonedDateTime;
      expect(zdt.hour).toBe(1);
      expect(zdt.minute).toBe(30);
      expect(zdt.offset).toBe(-6 * 3600 * 1000);
    });

    test('converts a string just before DST spring-forward (01:59:59 CST)', () => {
      const result = action['~run']({ typed: true, value: '2024-03-10T01:59:59-06:00[America/Chicago]' }, {});
      expect(result.typed).toBeTruthy();
      const zdt = result.value as ZonedDateTime;
      expect(zdt.hour).toBe(1);
      expect(zdt.minute).toBe(59);
      expect(zdt.second).toBe(59);
    });

    test('converts a string in Asia/Tokyo (UTC+9)', () => {
      const result = action['~run']({ typed: true, value: '2024-06-15T09:00:00+09:00[Asia/Tokyo]' }, {});
      expect(result.typed).toBeTruthy();
      const zdt = result.value as ZonedDateTime;
      expect(zdt.timeZone).toBe('Asia/Tokyo');
      expect(zdt.hour).toBe(9);
    });
  });

  describe('should convert Temporal.ZonedDateTime to @internationalized/date ZonedDateTime', () => {
    const action = toInternationalizedZonedDateTime();

    test('converts a UTC Temporal.ZonedDateTime', () => {
      const value = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const zdt = result.value as ZonedDateTime;
      expect(zdt.timeZone).toBe('UTC');
      expect(zdt.hour).toBe(12);
    });

    test('converts a Temporal.ZonedDateTime in CDT (UTC-5)', () => {
      const value = Temporal.ZonedDateTime.from('2024-06-15T12:00:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const zdt = result.value as ZonedDateTime;
      expect(zdt.timeZone).toBe('America/Chicago');
      expect(zdt.hour).toBe(12);
      expect(zdt.offset).toBe(-5 * 3600 * 1000);
    });

    test('converts a Temporal.ZonedDateTime in CST (UTC-6)', () => {
      const value = Temporal.ZonedDateTime.from('2024-01-15T12:00:00-06:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const zdt = result.value as ZonedDateTime;
      expect(zdt.offset).toBe(-6 * 3600 * 1000);
    });

    test('converts a Temporal.ZonedDateTime during DST fall-back (first 01:30 CDT)', () => {
      const value = Temporal.ZonedDateTime.from('2024-11-03T01:30:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const zdt = result.value as ZonedDateTime;
      expect(zdt.hour).toBe(1);
      expect(zdt.minute).toBe(30);
      expect(zdt.offset).toBe(-5 * 3600 * 1000);
    });

    test('converts a Temporal.ZonedDateTime during DST fall-back (second 01:30 CST)', () => {
      const value = Temporal.ZonedDateTime.from('2024-11-03T01:30:00-06:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const zdt = result.value as ZonedDateTime;
      expect(zdt.hour).toBe(1);
      expect(zdt.minute).toBe(30);
      expect(zdt.offset).toBe(-6 * 3600 * 1000);
    });

    test('converts a Temporal.ZonedDateTime in Asia/Tokyo (UTC+9)', () => {
      const value = Temporal.ZonedDateTime.from('2024-06-15T09:00:00+09:00[Asia/Tokyo]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const zdt = result.value as ZonedDateTime;
      expect(zdt.timeZone).toBe('Asia/Tokyo');
      expect(zdt.hour).toBe(9);
    });

    test('preserves milliseconds', () => {
      const value = Temporal.ZonedDateTime.from('2024-06-15T12:00:00.456+00:00[UTC]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const zdt = result.value as ZonedDateTime;
      expect(zdt.millisecond).toBe(456);
    });
  });

  describe('should pass an existing @internationalized/date ZonedDateTime through unchanged', () => {
    const action = toInternationalizedZonedDateTime();

    test('passes through a ZonedDateTime', () => {
      const value = parseZonedDateTime('2024-06-15T12:00:00+00:00[UTC]');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('passes through a ZonedDateTime with non-UTC timezone', () => {
      const value = parseZonedDateTime('2024-06-15T12:00:00-05:00[America/Chicago]');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues for invalid inputs', () => {
    const action = toInternationalizedZonedDateTime('message');
    const baseIssue: Omit<ToInternationalizedZonedDateTimeIssue<unknown>, 'input' | 'received'> = {
      kind: 'transformation',
      type: 'to_zoned_date_time',
      expected: null,
      message: 'message',
      requirement: undefined,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for null', () => {
      expect(action['~run']({ typed: true, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
        issues: [{ ...baseIssue, input: null, received: '"Invalid conversion option"' }],
      });
    });

    test('for numbers', () => {
      const value = 1_718_452_800_000;
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
      });
    });

    test('for Temporal.Instant', () => {
      const value = Temporal.Instant.from('2024-06-15T12:00:00Z');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
      });
    });

    test('for Temporal.PlainDate', () => {
      const value = Temporal.PlainDate.from('2024-06-15');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
      });
    });
  });
});
