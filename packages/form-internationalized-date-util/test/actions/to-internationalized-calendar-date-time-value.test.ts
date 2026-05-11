import { CalendarDateTime, parseZonedDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import type {
  ToInternationalizedCalendarDateTimeAction,
  ToInternationalizedCalendarDateTimeIssue,
} from '#src/actions/to-internationalized-calendar-date-time-value';
import { toInternationalizedCalendarDateTime } from '#src/actions/to-internationalized-calendar-date-time-value';

describe('toInternationalizedCalendarDateTime', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      expect(toInternationalizedCalendarDateTime()).toStrictEqual({
        kind: 'transformation',
        type: 'to_calendar_date_time',
        reference: toInternationalizedCalendarDateTime,
        async: false,
        message: undefined,
        '~run': expect.any(Function),
      } satisfies ToInternationalizedCalendarDateTimeAction<unknown, undefined>);
    });

    test('with string message', () => {
      expect(toInternationalizedCalendarDateTime('message')).toStrictEqual({
        kind: 'transformation',
        type: 'to_calendar_date_time',
        reference: toInternationalizedCalendarDateTime,
        async: false,
        message: 'message',
        '~run': expect.any(Function),
      } satisfies ToInternationalizedCalendarDateTimeAction<unknown, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(toInternationalizedCalendarDateTime(message)).toStrictEqual({
        kind: 'transformation',
        type: 'to_calendar_date_time',
        reference: toInternationalizedCalendarDateTime,
        async: false,
        message,
        '~run': expect.any(Function),
      } satisfies ToInternationalizedCalendarDateTimeAction<unknown, typeof message>);
    });
  });

  describe('should convert datetime strings to CalendarDateTime', () => {
    const action = toInternationalizedCalendarDateTime();

    test('converts an ISO datetime string', () => {
      const result = action['~run']({ typed: true, value: '2024-06-15T09:30:45' }, {});
      expect(result.typed).toBeTruthy();
      const cdt = result.value as CalendarDateTime;
      expect(cdt.year).toBe(2024);
      expect(cdt.month).toBe(6);
      expect(cdt.day).toBe(15);
      expect(cdt.hour).toBe(9);
      expect(cdt.minute).toBe(30);
      expect(cdt.second).toBe(45);
    });

    test('converts a datetime string at midnight', () => {
      const result = action['~run']({ typed: true, value: '2024-01-01T00:00:00' }, {});
      expect(result.typed).toBeTruthy();
      const cdt = result.value as CalendarDateTime;
      expect(cdt.hour).toBe(0);
      expect(cdt.minute).toBe(0);
    });

    test('converts a datetime string with milliseconds', () => {
      const result = action['~run']({ typed: true, value: '2024-06-15T09:30:45.123' }, {});
      expect(result.typed).toBeTruthy();
      const cdt = result.value as CalendarDateTime;
      expect(cdt.millisecond).toBe(123);
    });
  });

  describe('should convert Temporal.ZonedDateTime to CalendarDateTime', () => {
    const action = toInternationalizedCalendarDateTime();

    test('converts a UTC Temporal.ZonedDateTime', () => {
      const value = Temporal.ZonedDateTime.from('2024-06-15T12:30:00+00:00[UTC]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const cdt = result.value as CalendarDateTime;
      expect(cdt.year).toBe(2024);
      expect(cdt.month).toBe(6);
      expect(cdt.day).toBe(15);
      expect(cdt.hour).toBe(12);
      expect(cdt.minute).toBe(30);
    });

    test('converts a Temporal.ZonedDateTime in CDT (UTC-5) — preserves local time', () => {
      const value = Temporal.ZonedDateTime.from('2024-06-15T12:00:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const cdt = result.value as CalendarDateTime;
      expect(cdt.hour).toBe(12);
    });

    test('converts a Temporal.ZonedDateTime in CST (UTC-6) — preserves local time', () => {
      const value = Temporal.ZonedDateTime.from('2024-01-15T12:00:00-06:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const cdt = result.value as CalendarDateTime;
      expect(cdt.hour).toBe(12);
    });

    test('converts a Temporal.ZonedDateTime during DST spring-forward (just after, 03:00 CDT)', () => {
      const value = Temporal.ZonedDateTime.from('2024-03-10T03:00:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const cdt = result.value as CalendarDateTime;
      expect(cdt.hour).toBe(3);
      expect(cdt.minute).toBe(0);
    });

    test('converts a Temporal.ZonedDateTime during DST fall-back (first 01:30 CDT, UTC-5)', () => {
      const value = Temporal.ZonedDateTime.from('2024-11-03T01:30:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const cdt = result.value as CalendarDateTime;
      expect(cdt.day).toBe(3);
      expect(cdt.hour).toBe(1);
      expect(cdt.minute).toBe(30);
    });

    test('converts a Temporal.ZonedDateTime during DST fall-back (second 01:30 CST, UTC-6)', () => {
      const value = Temporal.ZonedDateTime.from('2024-11-03T01:30:00-06:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const cdt = result.value as CalendarDateTime;
      expect(cdt.day).toBe(3);
      expect(cdt.hour).toBe(1);
      expect(cdt.minute).toBe(30);
    });
  });

  describe('should convert Temporal.PlainDateTime to CalendarDateTime', () => {
    const action = toInternationalizedCalendarDateTime();

    test('converts a Temporal.PlainDateTime preserving all components', () => {
      const value = Temporal.PlainDateTime.from('2024-06-15T09:30:45.123');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const cdt = result.value as CalendarDateTime;
      expect(cdt.year).toBe(2024);
      expect(cdt.month).toBe(6);
      expect(cdt.day).toBe(15);
      expect(cdt.hour).toBe(9);
      expect(cdt.minute).toBe(30);
      expect(cdt.second).toBe(45);
      expect(cdt.millisecond).toBe(123);
    });
  });

  describe('should convert @internationalized/date ZonedDateTime to CalendarDateTime', () => {
    const action = toInternationalizedCalendarDateTime();

    test('converts an @internationalized ZonedDateTime in CDT', () => {
      const value = parseZonedDateTime('2024-06-15T12:30:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const cdt = result.value as CalendarDateTime;
      expect(cdt.year).toBe(2024);
      expect(cdt.month).toBe(6);
      expect(cdt.day).toBe(15);
      expect(cdt.hour).toBe(12);
      expect(cdt.minute).toBe(30);
    });
  });

  describe('should pass an existing CalendarDateTime through unchanged', () => {
    const action = toInternationalizedCalendarDateTime();

    test('passes through a CalendarDateTime', () => {
      const value = new CalendarDateTime('gregory', 2024, 6, 15, 9, 30, 45);
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues for invalid inputs', () => {
    const action = toInternationalizedCalendarDateTime('message');
    const baseIssue: Omit<ToInternationalizedCalendarDateTimeIssue<unknown>, 'input' | 'received'> = {
      kind: 'transformation',
      type: 'to_calendar_date_time',
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

    test('for Temporal.PlainTime', () => {
      const value = Temporal.PlainTime.from('12:00:00');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
      });
    });
  });
});
