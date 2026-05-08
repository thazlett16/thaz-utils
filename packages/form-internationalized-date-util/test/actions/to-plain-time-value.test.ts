import type { ToPlainTimeIssue } from '@thazstack/temporal-valibot-util';

import { CalendarDateTime, Time, parseZonedDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import type { ToPlainTimeAction } from '#src/actions/to-plain-time-value';
import { toPlainTime } from '#src/actions/to-plain-time-value';

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

  describe('should convert @internationalized/date ZonedDateTime to Temporal.PlainTime', () => {
    const action = toPlainTime();

    test('converts a UTC ZonedDateTime — extracts local time', () => {
      const value = parseZonedDateTime('2024-06-15T09:30:45+00:00[UTC]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const pt = result.value as Temporal.PlainTime;
      expect(pt.hour).toBe(9);
      expect(pt.minute).toBe(30);
      expect(pt.second).toBe(45);
    });

    test('converts a ZonedDateTime in CDT (UTC-5) — preserves local time', () => {
      const value = parseZonedDateTime('2024-06-15T12:30:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const pt = result.value as Temporal.PlainTime;
      expect(pt.hour).toBe(12);
      expect(pt.minute).toBe(30);
    });

    test('converts a ZonedDateTime at midnight', () => {
      const value = parseZonedDateTime('2024-01-01T00:00:00+00:00[UTC]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const pt = result.value as Temporal.PlainTime;
      expect(pt.hour).toBe(0);
      expect(pt.minute).toBe(0);
      expect(pt.second).toBe(0);
    });

    test('converts a ZonedDateTime during DST fall-back (first 01:30 CDT)', () => {
      const value = parseZonedDateTime('2024-11-03T01:30:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const pt = result.value as Temporal.PlainTime;
      expect(pt.hour).toBe(1);
      expect(pt.minute).toBe(30);
    });

    test('converts a ZonedDateTime during DST fall-back (second 01:30 CST)', () => {
      const value = parseZonedDateTime('2024-11-03T01:30:00-06:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const pt = result.value as Temporal.PlainTime;
      expect(pt.hour).toBe(1);
      expect(pt.minute).toBe(30);
    });
  });

  describe('should convert @internationalized/date CalendarDateTime to Temporal.PlainTime', () => {
    const action = toPlainTime();

    test('converts a CalendarDateTime preserving time components', () => {
      const value = new CalendarDateTime('gregory', 2024, 6, 15, 9, 30, 45, 123);
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const pt = result.value as Temporal.PlainTime;
      expect(pt.hour).toBe(9);
      expect(pt.minute).toBe(30);
      expect(pt.second).toBe(45);
      expect(pt.millisecond).toBe(123);
    });

    test('converts a CalendarDateTime at end of day', () => {
      const value = new CalendarDateTime('gregory', 2024, 6, 15, 23, 59, 59, 999);
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const pt = result.value as Temporal.PlainTime;
      expect(pt.hour).toBe(23);
      expect(pt.minute).toBe(59);
      expect(pt.second).toBe(59);
      expect(pt.millisecond).toBe(999);
    });
  });

  describe('should convert @internationalized/date Time to Temporal.PlainTime', () => {
    const action = toPlainTime();

    test('converts a Time preserving all components', () => {
      const value = new Time(9, 30, 45, 123);
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const pt = result.value as Temporal.PlainTime;
      expect(pt.hour).toBe(9);
      expect(pt.minute).toBe(30);
      expect(pt.second).toBe(45);
      expect(pt.millisecond).toBe(123);
    });

    test('converts midnight (00:00:00)', () => {
      const value = new Time(0, 0, 0);
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const pt = result.value as Temporal.PlainTime;
      expect(pt.hour).toBe(0);
      expect(pt.minute).toBe(0);
      expect(pt.second).toBe(0);
    });

    test('converts end-of-day (23:59:59.999)', () => {
      const value = new Time(23, 59, 59, 999);
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const pt = result.value as Temporal.PlainTime;
      expect(pt.hour).toBe(23);
      expect(pt.minute).toBe(59);
      expect(pt.second).toBe(59);
      expect(pt.millisecond).toBe(999);
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
      const value = '09:30:45';
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
