import type { Dayjs } from 'dayjs';
import { describe, expect, test } from 'vite-plus/test';

import type { IsDayJSValidAction, IsDayJSValidIssue } from '#src/actions/is-dayjs-valid';
import { isDayJSValid } from '#src/actions/is-dayjs-valid';
import { dayJS } from '#src/dayjs.config';

describe('isDayJSValid', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      expect(isDayJSValid()).toStrictEqual({
        kind: 'validation',
        type: 'is_dayjs_valid',
        reference: isDayJSValid,
        expects: null,
        async: false,
        message: undefined,
        '~run': expect.any(Function),
      } satisfies IsDayJSValidAction<Dayjs, undefined>);
    });

    test('with string message', () => {
      expect(isDayJSValid('message')).toStrictEqual({
        kind: 'validation',
        type: 'is_dayjs_valid',
        reference: isDayJSValid,
        expects: null,
        async: false,
        message: 'message',
        '~run': expect.any(Function),
      } satisfies IsDayJSValidAction<Dayjs, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(isDayJSValid(message)).toStrictEqual({
        kind: 'validation',
        type: 'is_dayjs_valid',
        reference: isDayJSValid,
        expects: null,
        async: false,
        message,
        '~run': expect.any(Function),
      } satisfies IsDayJSValidAction<Dayjs, typeof message>);
    });
  });

  describe('should pass valid DayJS instances unchanged', () => {
    const action = isDayJSValid();

    test('passes a DayJS from UTC ISO string', () => {
      const value = dayJS.utc('2024-06-15T12:00:00Z');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('passes a timezone-aware DayJS in summer (CDT, UTC-5)', () => {
      const value = dayJS.tz('2024-06-15T12:00:00', 'America/Chicago');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('passes a timezone-aware DayJS in winter (CST, UTC-6)', () => {
      const value = dayJS.tz('2024-01-15T12:00:00', 'America/Chicago');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('passes a DayJS at DST spring-forward (March 10 2024 at 03:00 CDT)', () => {
      const value = dayJS.tz('2024-03-10T03:00:00', 'America/Chicago');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('passes a DayJS during DST fall-back (first 01:30 CDT, UTC-5)', () => {
      const value = dayJS.utc('2024-11-03T06:30:00Z').tz('America/Chicago');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('passes a DayJS during DST fall-back (second 01:30 CST, UTC-6)', () => {
      const value = dayJS.utc('2024-11-03T07:30:00Z').tz('America/Chicago');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('passes a DayJS with European timezone (CET, UTC+1)', () => {
      const value = dayJS.tz('2024-01-15T12:00:00', 'Europe/London');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    test('passes a DayJS with European timezone in summer (BST, UTC+1)', () => {
      const value = dayJS.tz('2024-07-15T12:00:00', 'Europe/London');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues for invalid DayJS', () => {
    const action = isDayJSValid('message');
    const baseIssue: Omit<IsDayJSValidIssue<Dayjs>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'is_dayjs_valid',
      expected: null,
      message: 'message',
      requirement: undefined,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for DayJS from a non-date string', () => {
      const value = dayJS('not-a-date');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: '"Invalid Date"' }],
      });
    });

    test('for DayJS from NaN', () => {
      const value = dayJS(Number.NaN);
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: true,
        value,
        issues: [{ ...baseIssue, input: value, received: '"Invalid Date"' }],
      });
    });
  });
});
