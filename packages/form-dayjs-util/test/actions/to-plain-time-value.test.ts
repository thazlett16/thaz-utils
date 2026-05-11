import type { ToPlainTimeIssue } from '@thazstack/temporal-valibot-util';

import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import type { ToPlainTimeAction } from '#src/actions/to-plain-time-value';
import { toPlainTime } from '#src/actions/to-plain-time-value';
import { dayJS } from '#src/dayjs.config';

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
      } satisfies ToPlainTimeAction<unknown, undefined>);
    });

    test('with string message', () => {
      expect(toPlainTime('message')).toStrictEqual({
        kind: 'transformation',
        type: 'to_plain_time',
        reference: toPlainTime,
        async: false,
        message: 'message',
        '~run': expect.any(Function),
      } satisfies ToPlainTimeAction<unknown, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(toPlainTime(message)).toStrictEqual({
        kind: 'transformation',
        type: 'to_plain_time',
        reference: toPlainTime,
        async: false,
        message,
        '~run': expect.any(Function),
      } satisfies ToPlainTimeAction<unknown, typeof message>);
    });
  });

  describe('should convert DayJS to Temporal.PlainTime', () => {
    const action = toPlainTime();

    test('converts a UTC DayJS preserving time components', () => {
      const value = dayJS.utc('2024-06-15T09:30:45.123Z');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      expect(result.value).toStrictEqual(Temporal.PlainTime.from('09:30:45.123'));
    });

    test('converts a timezone-aware DayJS (CDT, UTC-5) — uses local time', () => {
      const value = dayJS.tz('2024-06-15T12:30:00', 'America/Chicago');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const pt = result.value as Temporal.PlainTime;
      expect(pt.hour).toBe(12);
      expect(pt.minute).toBe(30);
      expect(pt.second).toBe(0);
    });

    test('converts a DayJS at midnight (00:00:00)', () => {
      const value = dayJS.utc('2024-01-01T00:00:00.000Z');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      expect(result.value).toStrictEqual(Temporal.PlainTime.from('00:00:00'));
    });

    test('converts a DayJS at end of day (23:59:59.999)', () => {
      const value = dayJS.utc('2024-12-31T23:59:59.999Z');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const pt = result.value as Temporal.PlainTime;
      expect(pt.hour).toBe(23);
      expect(pt.minute).toBe(59);
      expect(pt.second).toBe(59);
      expect(pt.millisecond).toBe(999);
    });

    test('converts DayJS during DST spring-forward (just before 02:00 CST, at 01:59:59)', () => {
      const value = dayJS.tz('2024-03-10T01:59:59', 'America/Chicago');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const pt = result.value as Temporal.PlainTime;
      expect(pt.hour).toBe(1);
      expect(pt.minute).toBe(59);
      expect(pt.second).toBe(59);
    });

    test('converts DayJS just after DST spring-forward (03:00:00 CDT)', () => {
      const value = dayJS.tz('2024-03-10T03:00:00', 'America/Chicago');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const pt = result.value as Temporal.PlainTime;
      expect(pt.hour).toBe(3);
      expect(pt.minute).toBe(0);
    });

    test('converts DayJS during DST fall-back (first 01:30 CDT)', () => {
      const value = dayJS.utc('2024-11-03T06:30:00Z').tz('America/Chicago');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const pt = result.value as Temporal.PlainTime;
      expect(pt.hour).toBe(1);
      expect(pt.minute).toBe(30);
    });

    test('converts DayJS during DST fall-back (second 01:30 CST)', () => {
      const value = dayJS.utc('2024-11-03T07:30:00Z').tz('America/Chicago');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const pt = result.value as Temporal.PlainTime;
      expect(pt.hour).toBe(1);
      expect(pt.minute).toBe(30);
    });

    test('converts DayJS in Asia/Tokyo (UTC+9) — uses local time', () => {
      const value = dayJS.tz('2024-06-15T09:00:00', 'Asia/Tokyo');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const pt = result.value as Temporal.PlainTime;
      expect(pt.hour).toBe(9);
      expect(pt.minute).toBe(0);
    });

    test('converts DayJS with millisecond precision', () => {
      const value = dayJS.utc('2024-06-15T15:45:30.456Z');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const pt = result.value as Temporal.PlainTime;
      expect(pt.hour).toBe(15);
      expect(pt.minute).toBe(45);
      expect(pt.second).toBe(30);
      expect(pt.millisecond).toBe(456);
    });
  });

  describe('should pass an existing Temporal.PlainTime through unchanged', () => {
    const action = toPlainTime();

    test('passes through a Temporal.PlainTime', () => {
      const value = Temporal.PlainTime.from('09:30:45.123');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues for invalid inputs', () => {
    const action = toPlainTime('message');
    const baseIssue: Omit<ToPlainTimeIssue<unknown>, 'input' | 'received'> = {
      kind: 'transformation',
      type: 'to_plain_time',
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
      const value = '12:00:00';
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
