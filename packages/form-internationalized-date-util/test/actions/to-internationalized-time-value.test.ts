import { CalendarDateTime, Time, parseZonedDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import type {
  ToInternationalizedTimeAction,
  ToInternationalizedTimeIssue,
} from '#src/actions/to-internationalized-time-value';
import { toInternationalizedTime } from '#src/actions/to-internationalized-time-value';

describe('toInternationalizedTime', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      expect(toInternationalizedTime()).toStrictEqual({
        kind: 'transformation',
        type: 'to_time',
        reference: toInternationalizedTime,
        async: false,
        message: undefined,
        '~run': expect.any(Function),
      } satisfies ToInternationalizedTimeAction<unknown, undefined>);
    });

    test('with string message', () => {
      expect(toInternationalizedTime('message')).toStrictEqual({
        kind: 'transformation',
        type: 'to_time',
        reference: toInternationalizedTime,
        async: false,
        message: 'message',
        '~run': expect.any(Function),
      } satisfies ToInternationalizedTimeAction<unknown, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(toInternationalizedTime(message)).toStrictEqual({
        kind: 'transformation',
        type: 'to_time',
        reference: toInternationalizedTime,
        async: false,
        message,
        '~run': expect.any(Function),
      } satisfies ToInternationalizedTimeAction<unknown, typeof message>);
    });
  });

  describe('should convert time strings to Time', () => {
    const action = toInternationalizedTime();

    test('converts a time string', () => {
      const result = action['~run']({ typed: true, value: '09:30:45' }, {});
      expect(result.typed).toBeTruthy();
      const t = result.value as Time;
      expect(t.hour).toBe(9);
      expect(t.minute).toBe(30);
      expect(t.second).toBe(45);
    });

    test('converts midnight', () => {
      const result = action['~run']({ typed: true, value: '00:00:00' }, {});
      expect(result.typed).toBeTruthy();
      const t = result.value as Time;
      expect(t.hour).toBe(0);
      expect(t.minute).toBe(0);
      expect(t.second).toBe(0);
    });

    test('converts end of day', () => {
      const result = action['~run']({ typed: true, value: '23:59:59.999' }, {});
      expect(result.typed).toBeTruthy();
      const t = result.value as Time;
      expect(t.hour).toBe(23);
      expect(t.minute).toBe(59);
      expect(t.second).toBe(59);
      expect(t.millisecond).toBe(999);
    });
  });

  describe('should convert Temporal.ZonedDateTime to Time', () => {
    const action = toInternationalizedTime();

    test('converts a UTC Temporal.ZonedDateTime — extracts local time', () => {
      const value = Temporal.ZonedDateTime.from('2024-06-15T09:30:45+00:00[UTC]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const t = result.value as Time;
      expect(t.hour).toBe(9);
      expect(t.minute).toBe(30);
      expect(t.second).toBe(45);
    });

    test('converts a Temporal.ZonedDateTime in CDT (UTC-5) — preserves local time', () => {
      const value = Temporal.ZonedDateTime.from('2024-06-15T12:30:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const t = result.value as Time;
      expect(t.hour).toBe(12);
      expect(t.minute).toBe(30);
    });

    test('converts a Temporal.ZonedDateTime during DST fall-back (first 01:30 CDT)', () => {
      const value = Temporal.ZonedDateTime.from('2024-11-03T01:30:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const t = result.value as Time;
      expect(t.hour).toBe(1);
      expect(t.minute).toBe(30);
    });

    test('converts a Temporal.ZonedDateTime during DST fall-back (second 01:30 CST)', () => {
      const value = Temporal.ZonedDateTime.from('2024-11-03T01:30:00-06:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const t = result.value as Time;
      expect(t.hour).toBe(1);
      expect(t.minute).toBe(30);
    });
  });

  describe('should convert Temporal.PlainDateTime to Time', () => {
    const action = toInternationalizedTime();

    test('converts a Temporal.PlainDateTime preserving time components', () => {
      const value = Temporal.PlainDateTime.from('2024-06-15T09:30:45.123');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const t = result.value as Time;
      expect(t.hour).toBe(9);
      expect(t.minute).toBe(30);
      expect(t.second).toBe(45);
      expect(t.millisecond).toBe(123);
    });
  });

  describe('should convert Temporal.PlainTime to Time', () => {
    const action = toInternationalizedTime();

    test('converts a Temporal.PlainTime', () => {
      const value = Temporal.PlainTime.from('09:30:45.123');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const t = result.value as Time;
      expect(t.hour).toBe(9);
      expect(t.minute).toBe(30);
      expect(t.second).toBe(45);
      expect(t.millisecond).toBe(123);
    });
  });

  describe('should convert @internationalized/date ZonedDateTime to Time', () => {
    const action = toInternationalizedTime();

    test('converts an @internationalized ZonedDateTime — extracts local time', () => {
      const value = parseZonedDateTime('2024-06-15T12:30:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const t = result.value as Time;
      expect(t.hour).toBe(12);
      expect(t.minute).toBe(30);
    });
  });

  describe('should convert @internationalized/date CalendarDateTime to Time', () => {
    const action = toInternationalizedTime();

    test('converts a CalendarDateTime preserving time components', () => {
      const value = new CalendarDateTime('gregory', 2024, 6, 15, 9, 30, 45, 123);
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const t = result.value as Time;
      expect(t.hour).toBe(9);
      expect(t.minute).toBe(30);
      expect(t.second).toBe(45);
      expect(t.millisecond).toBe(123);
    });
  });

  describe('should pass an existing Time through unchanged', () => {
    const action = toInternationalizedTime();

    test('passes through a Time', () => {
      const value = new Time(9, 30, 45, 123);
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues for invalid inputs', () => {
    const action = toInternationalizedTime('message');
    const baseIssue: Omit<ToInternationalizedTimeIssue<unknown>, 'input' | 'received'> = {
      kind: 'transformation',
      type: 'to_time',
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
