import { CalendarDate, CalendarDateTime, parseZonedDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vitest';

import type { ToPlainDateAction } from '#src/actions/to-plain-date-value';
import type { ToPlainDateIssue } from '@thazstack/temporal-valibot-util';

import { toPlainDate } from '#src/actions/to-plain-date-value';

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

  describe('should convert @internationalized/date ZonedDateTime to Temporal.PlainDate', () => {
    const action = toPlainDate();

    it('converts a UTC ZonedDateTime', () => {
      const value = parseZonedDateTime('2024-06-15T12:00:00+00:00[UTC]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      expect(result.value).toEqual(Temporal.PlainDate.from('2024-06-15'));
    });

    it('converts a ZonedDateTime in CDT (UTC-5)', () => {
      const value = parseZonedDateTime('2024-06-15T12:00:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      expect(result.value).toEqual(Temporal.PlainDate.from('2024-06-15'));
    });

    it('converts a ZonedDateTime in CST (UTC-6)', () => {
      const value = parseZonedDateTime('2024-01-15T12:00:00-06:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      expect(result.value).toEqual(Temporal.PlainDate.from('2024-01-15'));
    });

    it('extracts correct year/month/day from ZonedDateTime', () => {
      const value = parseZonedDateTime('2024-11-03T01:30:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const pd = result.value as Temporal.PlainDate;
      expect(pd.year).toBe(2024);
      expect(pd.month).toBe(11);
      expect(pd.day).toBe(3);
    });
  });

  describe('should convert @internationalized/date CalendarDateTime to Temporal.PlainDate', () => {
    const action = toPlainDate();

    it('converts a CalendarDateTime preserving date components', () => {
      const value = new CalendarDateTime('gregory', 2024, 6, 15, 9, 30, 45);
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const pd = result.value as Temporal.PlainDate;
      expect(pd.year).toBe(2024);
      expect(pd.month).toBe(6);
      expect(pd.day).toBe(15);
    });

    it('converts a CalendarDateTime at year boundary', () => {
      const value = new CalendarDateTime('gregory', 2024, 1, 1, 0, 0, 0);
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const pd = result.value as Temporal.PlainDate;
      expect(pd.year).toBe(2024);
      expect(pd.month).toBe(1);
      expect(pd.day).toBe(1);
    });
  });

  describe('should convert @internationalized/date CalendarDate to Temporal.PlainDate', () => {
    const action = toPlainDate();

    it('converts a CalendarDate', () => {
      const value = new CalendarDate('gregory', 2024, 6, 15);
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      expect(result.value).toEqual(Temporal.PlainDate.from('2024-06-15'));
    });

    it('converts a CalendarDate at Dec 31', () => {
      const value = new CalendarDate('gregory', 2023, 12, 31);
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      expect(result.value).toEqual(Temporal.PlainDate.from('2023-12-31'));
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
