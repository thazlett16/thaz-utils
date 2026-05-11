import { CalendarDate, CalendarDateTime, parseZonedDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import type {
  ToInternationalizedCalendarDateAction,
  ToInternationalizedCalendarDateIssue,
} from '#src/actions/to-internationalized-calendar-date-value';
import { toInternationalizedCalendarDate } from '#src/actions/to-internationalized-calendar-date-value';

describe('toInternationalizedCalendarDate', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      expect(toInternationalizedCalendarDate()).toStrictEqual({
        kind: 'transformation',
        type: 'to_calendar_date',
        reference: toInternationalizedCalendarDate,
        async: false,
        message: undefined,
        '~run': expect.any(Function),
      } satisfies ToInternationalizedCalendarDateAction<unknown, undefined>);
    });

    test('with string message', () => {
      expect(toInternationalizedCalendarDate('message')).toStrictEqual({
        kind: 'transformation',
        type: 'to_calendar_date',
        reference: toInternationalizedCalendarDate,
        async: false,
        message: 'message',
        '~run': expect.any(Function),
      } satisfies ToInternationalizedCalendarDateAction<unknown, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(toInternationalizedCalendarDate(message)).toStrictEqual({
        kind: 'transformation',
        type: 'to_calendar_date',
        reference: toInternationalizedCalendarDate,
        async: false,
        message,
        '~run': expect.any(Function),
      } satisfies ToInternationalizedCalendarDateAction<unknown, typeof message>);
    });
  });

  describe('should convert date strings to CalendarDate', () => {
    const action = toInternationalizedCalendarDate();

    test('converts a date string', () => {
      const result = action['~run']({ typed: true, value: '2024-06-15' }, {});
      expect(result.typed).toBeTruthy();
      const cd = result.value as CalendarDate;
      expect(cd.year).toBe(2024);
      expect(cd.month).toBe(6);
      expect(cd.day).toBe(15);
    });

    test('converts Jan 1', () => {
      const result = action['~run']({ typed: true, value: '2024-01-01' }, {});
      expect(result.typed).toBeTruthy();
      const cd = result.value as CalendarDate;
      expect(cd.year).toBe(2024);
      expect(cd.month).toBe(1);
      expect(cd.day).toBe(1);
    });

    test('converts Dec 31', () => {
      const result = action['~run']({ typed: true, value: '2023-12-31' }, {});
      expect(result.typed).toBeTruthy();
      const cd = result.value as CalendarDate;
      expect(cd.year).toBe(2023);
      expect(cd.month).toBe(12);
      expect(cd.day).toBe(31);
    });
  });

  describe('should convert Temporal.ZonedDateTime to CalendarDate', () => {
    const action = toInternationalizedCalendarDate();

    test('converts a UTC Temporal.ZonedDateTime', () => {
      const value = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const cd = result.value as CalendarDate;
      expect(cd.year).toBe(2024);
      expect(cd.month).toBe(6);
      expect(cd.day).toBe(15);
    });

    test('converts a Temporal.ZonedDateTime in CDT (UTC-5) — preserves local date', () => {
      const value = Temporal.ZonedDateTime.from('2024-06-15T12:00:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const cd = result.value as CalendarDate;
      expect(cd.year).toBe(2024);
      expect(cd.month).toBe(6);
      expect(cd.day).toBe(15);
    });

    test('converts a Temporal.ZonedDateTime during DST fall-back', () => {
      const value = Temporal.ZonedDateTime.from('2024-11-03T01:30:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const cd = result.value as CalendarDate;
      expect(cd.month).toBe(11);
      expect(cd.day).toBe(3);
    });
  });

  describe('should convert Temporal.PlainDateTime to CalendarDate', () => {
    const action = toInternationalizedCalendarDate();

    test('converts a Temporal.PlainDateTime preserving date components', () => {
      const value = Temporal.PlainDateTime.from('2024-06-15T09:30:45.123');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const cd = result.value as CalendarDate;
      expect(cd.year).toBe(2024);
      expect(cd.month).toBe(6);
      expect(cd.day).toBe(15);
    });
  });

  describe('should convert Temporal.PlainDate to CalendarDate', () => {
    const action = toInternationalizedCalendarDate();

    test('converts a Temporal.PlainDate', () => {
      const value = Temporal.PlainDate.from('2024-06-15');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const cd = result.value as CalendarDate;
      expect(cd.year).toBe(2024);
      expect(cd.month).toBe(6);
      expect(cd.day).toBe(15);
    });
  });

  describe('should convert @internationalized/date ZonedDateTime to CalendarDate', () => {
    const action = toInternationalizedCalendarDate();

    test('converts an @internationalized ZonedDateTime in CDT', () => {
      const value = parseZonedDateTime('2024-06-15T12:00:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const cd = result.value as CalendarDate;
      expect(cd.year).toBe(2024);
      expect(cd.month).toBe(6);
      expect(cd.day).toBe(15);
    });
  });

  describe('should convert @internationalized/date CalendarDateTime to CalendarDate', () => {
    const action = toInternationalizedCalendarDate();

    test('converts a CalendarDateTime', () => {
      const value = new CalendarDateTime('gregory', 2024, 6, 15, 9, 30, 45);
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      const cd = result.value as CalendarDate;
      expect(cd.year).toBe(2024);
      expect(cd.month).toBe(6);
      expect(cd.day).toBe(15);
    });
  });

  describe('should pass an existing CalendarDate through unchanged', () => {
    const action = toInternationalizedCalendarDate();

    test('passes through a CalendarDate', () => {
      const value = new CalendarDate('gregory', 2024, 6, 15);
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues for invalid inputs', () => {
    const action = toInternationalizedCalendarDate('message');
    const baseIssue: Omit<ToInternationalizedCalendarDateIssue<unknown>, 'input' | 'received'> = {
      kind: 'transformation',
      type: 'to_calendar_date',
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
