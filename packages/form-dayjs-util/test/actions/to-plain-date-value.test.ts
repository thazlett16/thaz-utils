import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vitest';

import type { ToPlainDateAction } from '#src/actions/to-plain-date-value';
import type { ToPlainDateIssue } from '@thazstack/temporal-valibot-util';

import { toPlainDate } from '#src/actions/to-plain-date-value';
import { dayJS } from '#src/dayjs.config';

describe('toPlainDate', () => {
  describe('should return action object', () => {
    it('with undefined message', () => {
      expect(toPlainDate()).toStrictEqual({
        kind: 'transformation',
        type: 'to_plain_date',
        reference: toPlainDate,
        async: false,
        message: undefined,
        '~run': expect.any(Function),
      } satisfies ToPlainDateAction<unknown, undefined>);
    });

    it('with string message', () => {
      expect(toPlainDate('message')).toStrictEqual({
        kind: 'transformation',
        type: 'to_plain_date',
        reference: toPlainDate,
        async: false,
        message: 'message',
        '~run': expect.any(Function),
      } satisfies ToPlainDateAction<unknown, string>);
    });

    it('with function message', () => {
      const message = () => 'message';
      expect(toPlainDate(message)).toStrictEqual({
        kind: 'transformation',
        type: 'to_plain_date',
        reference: toPlainDate,
        async: false,
        message,
        '~run': expect.any(Function),
      } satisfies ToPlainDateAction<unknown, typeof message>);
    });
  });

  describe('should convert DayJS to Temporal.PlainDate', () => {
    const action = toPlainDate();

    it('converts a UTC DayJS to PlainDate', () => {
      const value = dayJS.utc('2024-06-15T12:00:00Z');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      expect(result.value).toEqual(Temporal.PlainDate.from('2024-06-15'));
    });

    it('converts a timezone-aware DayJS (CDT, UTC-5) — uses local date', () => {
      const value = dayJS.tz('2024-06-15T12:00:00', 'America/Chicago');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      expect(result.value).toEqual(Temporal.PlainDate.from('2024-06-15'));
    });

    it('converts a timezone-aware DayJS (CST, UTC-6) — uses local date', () => {
      const value = dayJS.tz('2024-01-15T12:00:00', 'America/Chicago');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      expect(result.value).toEqual(Temporal.PlainDate.from('2024-01-15'));
    });

    it('converts DayJS at year boundary (Dec 31)', () => {
      const value = dayJS.utc('2023-12-31T23:59:59Z');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      expect(result.value).toEqual(Temporal.PlainDate.from('2023-12-31'));
    });

    it('converts DayJS at year boundary (Jan 1)', () => {
      const value = dayJS.utc('2024-01-01T00:00:00Z');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      expect(result.value).toEqual(Temporal.PlainDate.from('2024-01-01'));
    });

    it('converts a DayJS during DST spring-forward day (March 10 2024)', () => {
      const value = dayJS.tz('2024-03-10T03:00:00', 'America/Chicago');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      expect(result.value).toEqual(Temporal.PlainDate.from('2024-03-10'));
    });

    it('converts a DayJS during DST fall-back day (November 3 2024)', () => {
      const value = dayJS.utc('2024-11-03T07:30:00Z').tz('America/Chicago');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      expect(result.value).toEqual(Temporal.PlainDate.from('2024-11-03'));
    });

    it('extracts correct year, month (1-indexed), and day', () => {
      const value = dayJS.utc('2024-08-20T00:00:00Z');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const pd = result.value as Temporal.PlainDate;
      expect(pd.year).toBe(2024);
      expect(pd.month).toBe(8);
      expect(pd.day).toBe(20);
    });

    it('converts a DayJS in Australia/Sydney (AEDT, UTC+11)', () => {
      const value = dayJS.tz('2024-01-15T12:00:00', 'Australia/Sydney');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      expect(result.value).toEqual(Temporal.PlainDate.from('2024-01-15'));
    });
  });

  describe('should pass an existing Temporal.PlainDate through unchanged', () => {
    const action = toPlainDate();

    it('passes through a Temporal.PlainDate', () => {
      const value = Temporal.PlainDate.from('2024-06-15');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues for invalid inputs', () => {
    const action = toPlainDate('message');
    const baseIssue: Omit<ToPlainDateIssue<unknown>, 'input' | 'received'> = {
      kind: 'transformation',
      type: 'to_plain_date',
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
      const value = '2024-06-15';
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
