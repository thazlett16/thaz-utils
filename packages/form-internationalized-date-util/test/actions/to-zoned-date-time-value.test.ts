import type { ToZonedDateTimeIssue } from '@thazstack/temporal-valibot-util';

import { ZonedDateTime, parseZonedDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import type { ToZonedDateTimeAction } from '#src/actions/to-zoned-date-time-value';
import { toZonedDateTime } from '#src/actions/to-zoned-date-time-value';

describe('toZonedDateTime', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      expect(toZonedDateTime()).toStrictEqual({
        kind: 'transformation',
        type: 'to_zoned_date_time',
        reference: toZonedDateTime,
        async: false,
        message: undefined,
        '~run': expect.any(Function),
      } satisfies ToZonedDateTimeAction<unknown, undefined>);
    });

    test('with string message', () => {
      expect(toZonedDateTime('message')).toStrictEqual({
        kind: 'transformation',
        type: 'to_zoned_date_time',
        reference: toZonedDateTime,
        async: false,
        message: 'message',
        '~run': expect.any(Function),
      } satisfies ToZonedDateTimeAction<unknown, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(toZonedDateTime(message)).toStrictEqual({
        kind: 'transformation',
        type: 'to_zoned_date_time',
        reference: toZonedDateTime,
        async: false,
        message,
        '~run': expect.any(Function),
      } satisfies ToZonedDateTimeAction<unknown, typeof message>);
    });
  });

  describe('should convert @internationalized/date ZonedDateTime to Temporal.ZonedDateTime', () => {
    const action = toZonedDateTime();

    test('converts a UTC ZonedDateTime', () => {
      const value = parseZonedDateTime('2024-06-15T12:00:00+00:00[UTC]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const zdt = result.value as Temporal.ZonedDateTime;
      expect(zdt.timeZoneId).toBe('UTC');
      expect(zdt.year).toBe(2024);
      expect(zdt.month).toBe(6);
      expect(zdt.day).toBe(15);
      expect(zdt.hour).toBe(12);
      expect(zdt.offset).toBe('+00:00');
    });

    test('converts a ZonedDateTime in CDT (UTC-5)', () => {
      const value = parseZonedDateTime('2024-06-15T12:00:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const zdt = result.value as Temporal.ZonedDateTime;
      expect(zdt.timeZoneId).toBe('America/Chicago');
      expect(zdt.hour).toBe(12);
      expect(zdt.offset).toBe('-05:00');
    });

    test('converts a ZonedDateTime in CST (UTC-6)', () => {
      const value = parseZonedDateTime('2024-01-15T12:00:00-06:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const zdt = result.value as Temporal.ZonedDateTime;
      expect(zdt.timeZoneId).toBe('America/Chicago');
      expect(zdt.offset).toBe('-06:00');
    });

    test('converts ZonedDateTime just before DST spring-forward (01:59:59 CST)', () => {
      const value = parseZonedDateTime('2024-03-10T01:59:59-06:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const zdt = result.value as Temporal.ZonedDateTime;
      expect(zdt.hour).toBe(1);
      expect(zdt.minute).toBe(59);
      expect(zdt.second).toBe(59);
      expect(zdt.offset).toBe('-06:00');
    });

    test('converts ZonedDateTime just after DST spring-forward (03:00:00 CDT)', () => {
      const value = parseZonedDateTime('2024-03-10T03:00:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const zdt = result.value as Temporal.ZonedDateTime;
      expect(zdt.hour).toBe(3);
      expect(zdt.minute).toBe(0);
      expect(zdt.offset).toBe('-05:00');
    });

    test('converts ZonedDateTime during DST fall-back (first 01:30, CDT, UTC-5)', () => {
      const value = parseZonedDateTime('2024-11-03T01:30:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const zdt = result.value as Temporal.ZonedDateTime;
      expect(zdt.hour).toBe(1);
      expect(zdt.minute).toBe(30);
      expect(zdt.offset).toBe('-05:00');
    });

    test('converts ZonedDateTime during DST fall-back (second 01:30, CST, UTC-6)', () => {
      const value = parseZonedDateTime('2024-11-03T01:30:00-06:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const zdt = result.value as Temporal.ZonedDateTime;
      expect(zdt.hour).toBe(1);
      expect(zdt.minute).toBe(30);
      expect(zdt.offset).toBe('-06:00');
    });

    test('converts a ZonedDateTime in Asia/Tokyo (UTC+9)', () => {
      const value = parseZonedDateTime('2024-06-15T09:00:00+09:00[Asia/Tokyo]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const zdt = result.value as Temporal.ZonedDateTime;
      expect(zdt.timeZoneId).toBe('Asia/Tokyo');
      expect(zdt.hour).toBe(9);
      expect(zdt.offset).toBe('+09:00');
    });

    test('converts a ZonedDateTime using ZonedDateTime constructor (UTC)', () => {
      const value = new ZonedDateTime(2024, 6, 15, 'UTC', 0, 12, 30, 0, 0);
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const zdt = result.value as Temporal.ZonedDateTime;
      expect(zdt.timeZoneId).toBe('UTC');
      expect(zdt.hour).toBe(12);
      expect(zdt.minute).toBe(30);
    });

    test('preserves milliseconds', () => {
      const value = parseZonedDateTime('2024-06-15T12:00:00.456+00:00[UTC]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const zdt = result.value as Temporal.ZonedDateTime;
      expect(zdt.millisecond).toBe(456);
    });
  });

  describe('should pass an existing Temporal.ZonedDateTime through unchanged', () => {
    const action = toZonedDateTime();

    test('passes through a Temporal.ZonedDateTime', () => {
      const value = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('passes through a Temporal.ZonedDateTime with non-UTC timezone', () => {
      const value = Temporal.ZonedDateTime.from('2024-06-15T12:00:00-05:00[America/Chicago]');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues for invalid inputs', () => {
    const action = toZonedDateTime('message');
    const baseIssue: Omit<ToZonedDateTimeIssue<unknown>, 'input' | 'received'> = {
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

    test('for strings', () => {
      const value = '2024-06-15T12:00:00+00:00[UTC]';
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
