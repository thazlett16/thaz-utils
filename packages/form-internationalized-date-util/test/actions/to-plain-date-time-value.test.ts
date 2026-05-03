import { CalendarDateTime, parseZonedDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vitest';

import type { ToPlainDateTimeAction } from '#src/actions/to-plain-date-time-value';
import type { ToPlainDateTimeIssue } from '@thazstack/temporal-valibot-util';

import { toPlainDateTime } from '#src/actions/to-plain-date-time-value';

describe('toPlainDateTime', () => {
  describe('should return action object', () => {
    it('with undefined message', () => {
      expect(toPlainDateTime()).toStrictEqual({
        kind: 'transformation',
        type: 'to_plain_date_time',
        reference: toPlainDateTime,
        async: false,
        message: undefined,
        '~run': expect.any(Function),
      } satisfies ToPlainDateTimeAction<unknown, undefined>);
    });

    it('with string message', () => {
      expect(toPlainDateTime('message')).toStrictEqual({
        kind: 'transformation',
        type: 'to_plain_date_time',
        reference: toPlainDateTime,
        async: false,
        message: 'message',
        '~run': expect.any(Function),
      } satisfies ToPlainDateTimeAction<unknown, string>);
    });

    it('with function message', () => {
      const message = () => 'message';
      expect(toPlainDateTime(message)).toStrictEqual({
        kind: 'transformation',
        type: 'to_plain_date_time',
        reference: toPlainDateTime,
        async: false,
        message,
        '~run': expect.any(Function),
      } satisfies ToPlainDateTimeAction<unknown, typeof message>);
    });
  });

  describe('should convert @internationalized/date ZonedDateTime to Temporal.PlainDateTime', () => {
    const action = toPlainDateTime();

    it('converts a UTC ZonedDateTime — uses local date/time (not UTC)', () => {
      const value = parseZonedDateTime('2024-06-15T12:30:45+00:00[UTC]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      expect(result.value).toEqual(Temporal.PlainDateTime.from('2024-06-15T12:30:45'));
    });

    it('converts a ZonedDateTime in CDT (UTC-5) — preserves local time', () => {
      const value = parseZonedDateTime('2024-06-15T12:00:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const pdt = result.value as Temporal.PlainDateTime;
      expect(pdt.year).toBe(2024);
      expect(pdt.month).toBe(6);
      expect(pdt.day).toBe(15);
      expect(pdt.hour).toBe(12);
    });

    it('converts a ZonedDateTime in CST (UTC-6) — preserves local time', () => {
      const value = parseZonedDateTime('2024-01-15T12:00:00-06:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const pdt = result.value as Temporal.PlainDateTime;
      expect(pdt.hour).toBe(12);
    });

    it('converts ZonedDateTime during DST fall-back (first 01:30 CDT)', () => {
      const value = parseZonedDateTime('2024-11-03T01:30:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const pdt = result.value as Temporal.PlainDateTime;
      expect(pdt.day).toBe(3);
      expect(pdt.hour).toBe(1);
      expect(pdt.minute).toBe(30);
    });

    it('converts ZonedDateTime during DST fall-back (second 01:30 CST)', () => {
      const value = parseZonedDateTime('2024-11-03T01:30:00-06:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const pdt = result.value as Temporal.PlainDateTime;
      expect(pdt.day).toBe(3);
      expect(pdt.hour).toBe(1);
      expect(pdt.minute).toBe(30);
    });

    it('converts ZonedDateTime just after DST spring-forward (03:00 CDT)', () => {
      const value = parseZonedDateTime('2024-03-10T03:00:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const pdt = result.value as Temporal.PlainDateTime;
      expect(pdt.hour).toBe(3);
      expect(pdt.minute).toBe(0);
    });
  });

  describe('should convert @internationalized/date CalendarDateTime to Temporal.PlainDateTime', () => {
    const action = toPlainDateTime();

    it('converts a CalendarDateTime preserving all components', () => {
      const value = new CalendarDateTime('gregory', 2024, 6, 15, 9, 30, 45, 123);
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const pdt = result.value as Temporal.PlainDateTime;
      expect(pdt.year).toBe(2024);
      expect(pdt.month).toBe(6);
      expect(pdt.day).toBe(15);
      expect(pdt.hour).toBe(9);
      expect(pdt.minute).toBe(30);
      expect(pdt.second).toBe(45);
      expect(pdt.millisecond).toBe(123);
    });

    it('converts a CalendarDateTime at midnight', () => {
      const value = new CalendarDateTime('gregory', 2024, 1, 1, 0, 0, 0, 0);
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const pdt = result.value as Temporal.PlainDateTime;
      expect(pdt.hour).toBe(0);
      expect(pdt.minute).toBe(0);
      expect(pdt.second).toBe(0);
    });
  });

  describe('should pass an existing Temporal.PlainDateTime through unchanged', () => {
    const action = toPlainDateTime();

    it('passes through a Temporal.PlainDateTime', () => {
      const value = Temporal.PlainDateTime.from('2024-06-15T09:30:45.123');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues for invalid inputs', () => {
    const action = toPlainDateTime('message');
    const baseIssue: Omit<ToPlainDateTimeIssue<unknown>, 'input' | 'received'> = {
      kind: 'transformation',
      type: 'to_plain_date_time',
      expected: null,
      message: 'message',
      requirement: undefined,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    it('for null', () => {
      expect(action['~run']({ typed: true, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
        issues: [{ ...baseIssue, input: null, received: '"Invalid conversion option"' }],
      });
    });

    it('for strings', () => {
      const value = '2024-06-15T12:00:00';
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
      });
    });

    it('for Temporal.Instant', () => {
      const value = Temporal.Instant.from('2024-06-15T12:00:00Z');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
      });
    });

    it('for Temporal.PlainDate', () => {
      const value = Temporal.PlainDate.from('2024-06-15');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
      });
    });
  });
});
