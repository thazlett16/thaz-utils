import { Temporal } from '@js-temporal/polyfill';
import type { Dayjs } from 'dayjs';
import { describe, expect, it } from 'vitest';

import type { ToDayJSAction, ToDayJSIssue } from '#src/actions/to-dayjs-value';

import { toDayJS } from '#src/actions/to-dayjs-value';
import { dayJS } from '#src/dayjs.config';

describe('toDayJS', () => {
  describe('should return action object', () => {
    it('with undefined message', () => {
      expect(toDayJS()).toStrictEqual({
        kind: 'transformation',
        type: 'to_dayjs',
        reference: toDayJS,
        async: false,
        message: undefined,
        '~run': expect.any(Function),
      } satisfies ToDayJSAction<unknown, undefined>);
    });

    it('with string message', () => {
      expect(toDayJS('message')).toStrictEqual({
        kind: 'transformation',
        type: 'to_dayjs',
        reference: toDayJS,
        async: false,
        message: 'message',
        '~run': expect.any(Function),
      } satisfies ToDayJSAction<unknown, string>);
    });

    it('with function message', () => {
      const message = () => 'message';
      expect(toDayJS(message)).toStrictEqual({
        kind: 'transformation',
        type: 'to_dayjs',
        reference: toDayJS,
        async: false,
        message,
        '~run': expect.any(Function),
      } satisfies ToDayJSAction<unknown, typeof message>);
    });
  });

  describe('should convert Temporal.ZonedDateTime to DayJS', () => {
    const action = toDayJS();

    it('converts a UTC ZonedDateTime', () => {
      const zdt = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
      const result = action['~run']({ typed: true, value: zdt }, {});
      expect(result.typed).toBe(true);
      expect((result.value as Dayjs).utc().toISOString()).toBe('2024-06-15T12:00:00.000Z');
    });

    it('converts a ZonedDateTime in summer (CDT, UTC-5)', () => {
      const zdt = Temporal.ZonedDateTime.from('2024-06-15T12:00:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value: zdt }, {});
      expect(result.typed).toBe(true);
      const djs = result.value as Dayjs;
      // 12:00 CDT = 17:00 UTC
      expect(djs.utc().toISOString()).toBe('2024-06-15T17:00:00.000Z');
      expect(djs.hour()).toBe(12);
      expect(djs.minute()).toBe(0);
    });

    it('converts a ZonedDateTime in winter (CST, UTC-6)', () => {
      const zdt = Temporal.ZonedDateTime.from('2024-01-15T12:00:00-06:00[America/Chicago]');
      const result = action['~run']({ typed: true, value: zdt }, {});
      expect(result.typed).toBe(true);
      const djs = result.value as Dayjs;
      // 12:00 CST = 18:00 UTC
      expect(djs.utc().toISOString()).toBe('2024-01-15T18:00:00.000Z');
      expect(djs.hour()).toBe(12);
    });

    it('converts a ZonedDateTime just before DST spring-forward (01:59:59 CST)', () => {
      const zdt = Temporal.ZonedDateTime.from('2024-03-10T01:59:59-06:00[America/Chicago]');
      const result = action['~run']({ typed: true, value: zdt }, {});
      expect(result.typed).toBe(true);
      const djs = result.value as Dayjs;
      expect(djs.utc().toISOString()).toBe('2024-03-10T07:59:59.000Z');
      expect(djs.hour()).toBe(1);
      expect(djs.minute()).toBe(59);
      expect(djs.second()).toBe(59);
    });

    it('converts a ZonedDateTime just after DST spring-forward (03:00:00 CDT)', () => {
      const zdt = Temporal.ZonedDateTime.from('2024-03-10T03:00:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value: zdt }, {});
      expect(result.typed).toBe(true);
      const djs = result.value as Dayjs;
      expect(djs.utc().toISOString()).toBe('2024-03-10T08:00:00.000Z');
      expect(djs.hour()).toBe(3);
      expect(djs.minute()).toBe(0);
    });

    it('converts a ZonedDateTime during DST fall-back (first 01:30, CDT, UTC-5)', () => {
      // Clocks fall back at 2:00 AM CDT → 1:00 AM CST. The 1:30 AM CDT occurs first.
      const zdt = Temporal.ZonedDateTime.from('2024-11-03T01:30:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value: zdt }, {});
      expect(result.typed).toBe(true);
      const djs = result.value as Dayjs;
      // 01:30 CDT (-5) = 06:30 UTC
      expect(djs.utc().toISOString()).toBe('2024-11-03T06:30:00.000Z');
      expect(djs.hour()).toBe(1);
      expect(djs.minute()).toBe(30);
    });

    it('converts a ZonedDateTime after DST fall-back (02:30 CST, UTC-6)', () => {
      // Use 02:30 CST which is unambiguous (past the ambiguous 01:xx hour)
      const zdt = Temporal.ZonedDateTime.from('2024-11-03T02:30:00-06:00[America/Chicago]');
      const result = action['~run']({ typed: true, value: zdt }, {});
      expect(result.typed).toBe(true);
      const djs = result.value as Dayjs;
      // 02:30 CST (-6) = 08:30 UTC
      expect(djs.utc().toISOString()).toBe('2024-11-03T08:30:00.000Z');
      expect(djs.hour()).toBe(2);
      expect(djs.minute()).toBe(30);
    });

    it('converts a ZonedDateTime with positive UTC offset (Asia/Tokyo, UTC+9)', () => {
      const zdt = Temporal.ZonedDateTime.from('2024-06-15T09:00:00+09:00[Asia/Tokyo]');
      const result = action['~run']({ typed: true, value: zdt }, {});
      expect(result.typed).toBe(true);
      const djs = result.value as Dayjs;
      // 09:00 JST (+9) = 00:00 UTC
      expect(djs.utc().toISOString()).toBe('2024-06-15T00:00:00.000Z');
      expect(djs.hour()).toBe(9);
    });

    it('converts a ZonedDateTime milliseconds before DST spring-forward gap starts (01:59:59.999 CST)', () => {
      // The last valid moment before the gap: 2024-03-10 01:59:59.999 CST = 07:59:59.999 UTC
      const zdt = Temporal.ZonedDateTime.from('2024-03-10T01:59:59.999-06:00[America/Chicago]');
      const result = action['~run']({ typed: true, value: zdt }, {});
      expect(result.typed).toBe(true);
      const djs = result.value as Dayjs;
      expect(djs.utc().toISOString()).toBe('2024-03-10T07:59:59.999Z');
      expect(djs.hour()).toBe(1);
      expect(djs.minute()).toBe(59);
      expect(djs.millisecond()).toBe(999);
    });
  });

  describe('should convert Temporal.Instant to DayJS', () => {
    const action = toDayJS();

    it('converts a Temporal.Instant at UTC epoch', () => {
      const inst = Temporal.Instant.fromEpochMilliseconds(0);
      const result = action['~run']({ typed: true, value: inst }, {});
      expect(result.typed).toBe(true);
      expect((result.value as Dayjs).utc().toISOString()).toBe('1970-01-01T00:00:00.000Z');
    });

    it('converts a Temporal.Instant to UTC DayJS', () => {
      const inst = Temporal.Instant.from('2024-06-15T17:00:00Z');
      const result = action['~run']({ typed: true, value: inst }, {});
      expect(result.typed).toBe(true);
      expect((result.value as Dayjs).utc().toISOString()).toBe('2024-06-15T17:00:00.000Z');
    });

    it('converts a Temporal.Instant at DST spring-forward boundary', () => {
      const inst = Temporal.Instant.from('2024-03-10T08:00:00Z'); // = 03:00 CDT
      const result = action['~run']({ typed: true, value: inst }, {});
      expect(result.typed).toBe(true);
      expect((result.value as Dayjs).utc().toISOString()).toBe('2024-03-10T08:00:00.000Z');
    });
  });

  describe('should convert Temporal.PlainDateTime to DayJS', () => {
    const action = toDayJS();

    it('converts a Temporal.PlainDateTime preserving all components', () => {
      const pdt = Temporal.PlainDateTime.from('2024-06-15T09:30:45.123');
      const result = action['~run']({ typed: true, value: pdt }, {});
      expect(result.typed).toBe(true);
      const djs = result.value as Dayjs;
      expect(djs.year()).toBe(2024);
      expect(djs.month()).toBe(5); // DayJS months are 0-indexed
      expect(djs.date()).toBe(15);
      expect(djs.hour()).toBe(9);
      expect(djs.minute()).toBe(30);
      expect(djs.second()).toBe(45);
      expect(djs.millisecond()).toBe(123);
    });

    it('converts a Temporal.PlainDateTime at midnight', () => {
      const pdt = Temporal.PlainDateTime.from('2024-01-01T00:00:00');
      const result = action['~run']({ typed: true, value: pdt }, {});
      expect(result.typed).toBe(true);
      const djs = result.value as Dayjs;
      expect(djs.hour()).toBe(0);
      expect(djs.minute()).toBe(0);
      expect(djs.second()).toBe(0);
    });

    it('converts a Temporal.PlainDateTime in December — month index boundary (12 → 11)', () => {
      // Temporal.PlainDateTime.month is 1-indexed (Dec=12), dayjs.month() is 0-indexed (Dec=11)
      const pdt = Temporal.PlainDateTime.from('2023-12-31T23:59:59.999');
      const result = action['~run']({ typed: true, value: pdt }, {});
      expect(result.typed).toBe(true);
      const djs = result.value as Dayjs;
      expect(djs.year()).toBe(2023);
      expect(djs.month()).toBe(11); // December = 11
      expect(djs.date()).toBe(31);
      expect(djs.hour()).toBe(23);
      expect(djs.minute()).toBe(59);
      expect(djs.second()).toBe(59);
      expect(djs.millisecond()).toBe(999);
    });
  });

  describe('should convert Temporal.PlainDate to DayJS', () => {
    const action = toDayJS();

    it('converts a Temporal.PlainDate preserving year/month/day', () => {
      const pd = Temporal.PlainDate.from('2024-06-15');
      const result = action['~run']({ typed: true, value: pd }, {});
      expect(result.typed).toBe(true);
      const djs = result.value as Dayjs;
      expect(djs.year()).toBe(2024);
      expect(djs.month()).toBe(5); // DayJS months are 0-indexed
      expect(djs.date()).toBe(15);
    });

    it('converts a Temporal.PlainDate at year boundary', () => {
      const pd = Temporal.PlainDate.from('2024-01-01');
      const result = action['~run']({ typed: true, value: pd }, {});
      expect(result.typed).toBe(true);
      const djs = result.value as Dayjs;
      expect(djs.year()).toBe(2024);
      expect(djs.month()).toBe(0); // January = 0
      expect(djs.date()).toBe(1);
    });

    it('converts a Temporal.PlainDate at Dec 31 — month index boundary (12 → 11)', () => {
      // Temporal.PlainDate.month is 1-indexed (Dec=12), dayjs.month() is 0-indexed (Dec=11)
      // Verifies the `value.month - 1` adjustment is correct at the upper boundary
      const pd = Temporal.PlainDate.from('2023-12-31');
      const result = action['~run']({ typed: true, value: pd }, {});
      expect(result.typed).toBe(true);
      const djs = result.value as Dayjs;
      expect(djs.year()).toBe(2023);
      expect(djs.month()).toBe(11); // December = 11
      expect(djs.date()).toBe(31);
    });
  });

  describe('should convert Temporal.PlainTime to DayJS', () => {
    const action = toDayJS();

    it('converts a Temporal.PlainTime preserving all time components', () => {
      const pt = Temporal.PlainTime.from('09:30:45.123');
      const result = action['~run']({ typed: true, value: pt }, {});
      expect(result.typed).toBe(true);
      const djs = result.value as Dayjs;
      expect(djs.hour()).toBe(9);
      expect(djs.minute()).toBe(30);
      expect(djs.second()).toBe(45);
      expect(djs.millisecond()).toBe(123);
    });

    it('converts midnight (00:00:00)', () => {
      const pt = Temporal.PlainTime.from('00:00:00');
      const result = action['~run']({ typed: true, value: pt }, {});
      expect(result.typed).toBe(true);
      const djs = result.value as Dayjs;
      expect(djs.hour()).toBe(0);
      expect(djs.minute()).toBe(0);
      expect(djs.second()).toBe(0);
    });

    it('converts end-of-day (23:59:59.999)', () => {
      const pt = Temporal.PlainTime.from('23:59:59.999');
      const result = action['~run']({ typed: true, value: pt }, {});
      expect(result.typed).toBe(true);
      const djs = result.value as Dayjs;
      expect(djs.hour()).toBe(23);
      expect(djs.minute()).toBe(59);
      expect(djs.second()).toBe(59);
      expect(djs.millisecond()).toBe(999);
    });
  });

  describe('should pass an existing DayJS through unchanged', () => {
    const action = toDayJS();

    it('passes through a UTC DayJS', () => {
      const value = dayJS.utc('2024-06-15T12:00:00Z');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    it('passes through a timezone-aware DayJS', () => {
      const value = dayJS.tz('2024-06-15T12:00:00', 'America/Chicago');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues for invalid inputs', () => {
    const action = toDayJS('message');
    const baseIssue: Omit<ToDayJSIssue<unknown>, 'input' | 'received'> = {
      kind: 'transformation',
      type: 'to_dayjs',
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
      const value = '2024-06-15T12:00:00Z';
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
      });
    });

    it('for numbers', () => {
      const value = 1718452800000;
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
      });
    });

    it('for plain objects', () => {
      const value = {};
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
      });
    });
  });
});
