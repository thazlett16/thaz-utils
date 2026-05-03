import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vitest';

import type { ToPlainDateTimeAction } from '#src/actions/to-plain-date-time-value';
import type { ToPlainDateTimeIssue } from '@thazstack/temporal-valibot-util';

import { toPlainDateTime } from '#src/actions/to-plain-date-time-value';
import { dayJS } from '#src/dayjs.config';

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

  describe('should convert DayJS to Temporal.PlainDateTime', () => {
    const action = toPlainDateTime();

    it('converts a UTC DayJS preserving all components', () => {
      const value = dayJS.utc('2024-06-15T09:30:45.123Z');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      expect(result.value).toEqual(Temporal.PlainDateTime.from('2024-06-15T09:30:45.123'));
    });

    it('converts a timezone-aware DayJS (CDT, UTC-5) — uses local date/time', () => {
      const value = dayJS.tz('2024-06-15T12:30:00', 'America/Chicago');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      expect(result.value).toEqual(Temporal.PlainDateTime.from('2024-06-15T12:30:00'));
    });

    it('converts a timezone-aware DayJS (CST, UTC-6) — uses local date/time', () => {
      const value = dayJS.tz('2024-01-15T12:30:00', 'America/Chicago');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      expect(result.value).toEqual(Temporal.PlainDateTime.from('2024-01-15T12:30:00'));
    });

    it('converts DayJS at midnight', () => {
      const value = dayJS.utc('2024-01-01T00:00:00.000Z');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const pdt = result.value as Temporal.PlainDateTime;
      expect(pdt.hour).toBe(0);
      expect(pdt.minute).toBe(0);
      expect(pdt.second).toBe(0);
      expect(pdt.millisecond).toBe(0);
    });

    it('converts DayJS just before DST spring-forward (01:59:59.999 CST)', () => {
      const value = dayJS.tz('2024-03-10T01:59:59', 'America/Chicago');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const pdt = result.value as Temporal.PlainDateTime;
      expect(pdt.year).toBe(2024);
      expect(pdt.month).toBe(3);
      expect(pdt.day).toBe(10);
      expect(pdt.hour).toBe(1);
      expect(pdt.minute).toBe(59);
      expect(pdt.second).toBe(59);
    });

    it('converts DayJS just after DST spring-forward (03:00:00 CDT)', () => {
      const value = dayJS.tz('2024-03-10T03:00:00', 'America/Chicago');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const pdt = result.value as Temporal.PlainDateTime;
      expect(pdt.hour).toBe(3);
      expect(pdt.minute).toBe(0);
    });

    it('converts DayJS during DST fall-back (first 01:30, CDT)', () => {
      const value = dayJS.utc('2024-11-03T06:30:00Z').tz('America/Chicago');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const pdt = result.value as Temporal.PlainDateTime;
      expect(pdt.day).toBe(3);
      expect(pdt.hour).toBe(1);
      expect(pdt.minute).toBe(30);
    });

    it('converts DayJS during DST fall-back (second 01:30, CST)', () => {
      const value = dayJS.utc('2024-11-03T07:30:00Z').tz('America/Chicago');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const pdt = result.value as Temporal.PlainDateTime;
      expect(pdt.day).toBe(3);
      expect(pdt.hour).toBe(1);
      expect(pdt.minute).toBe(30);
    });

    it('converts DayJS with millisecond precision', () => {
      const value = dayJS.utc('2024-06-15T09:30:45.999Z');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const pdt = result.value as Temporal.PlainDateTime;
      expect(pdt.millisecond).toBe(999);
    });

    it('converts DayJS in Australia/Sydney (AEDT, UTC+11) — uses local time', () => {
      const value = dayJS.tz('2024-01-15T12:00:00', 'Australia/Sydney');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const pdt = result.value as Temporal.PlainDateTime;
      expect(pdt.year).toBe(2024);
      expect(pdt.month).toBe(1);
      expect(pdt.day).toBe(15);
      expect(pdt.hour).toBe(12);
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

    it('for Temporal.PlainTime', () => {
      const value = Temporal.PlainTime.from('12:00:00');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
      });
    });
  });
});
