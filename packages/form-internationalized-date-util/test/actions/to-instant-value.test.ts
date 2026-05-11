import type { ToInstantIssue } from '@thazstack/temporal-valibot-util';

import { ZonedDateTime, parseZonedDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import type { ToInstantAction } from '#src/actions/to-instant-value';
import { toInstant } from '#src/actions/to-instant-value';

describe('toInstant', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      expect(toInstant()).toStrictEqual({
        kind: 'transformation',
        type: 'to_instant',
        reference: toInstant,
        async: false,
        message: undefined,
        '~run': expect.any(Function),
      } satisfies ToInstantAction<unknown, undefined>);
    });

    test('with string message', () => {
      expect(toInstant('message')).toStrictEqual({
        kind: 'transformation',
        type: 'to_instant',
        reference: toInstant,
        async: false,
        message: 'message',
        '~run': expect.any(Function),
      } satisfies ToInstantAction<unknown, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(toInstant(message)).toStrictEqual({
        kind: 'transformation',
        type: 'to_instant',
        reference: toInstant,
        async: false,
        message,
        '~run': expect.any(Function),
      } satisfies ToInstantAction<unknown, typeof message>);
    });
  });

  describe('should convert @internationalized/date ZonedDateTime to Temporal.Instant', () => {
    const action = toInstant();

    test('converts a UTC ZonedDateTime', () => {
      const value = parseZonedDateTime('2024-06-15T12:00:00+00:00[UTC]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      expect(result.value).toStrictEqual(Temporal.Instant.from('2024-06-15T12:00:00.000Z'));
    });

    test('converts a ZonedDateTime in summer (CDT, UTC-5)', () => {
      // 12:00 CDT = 17:00 UTC
      const value = parseZonedDateTime('2024-06-15T12:00:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      expect(result.value).toStrictEqual(Temporal.Instant.from('2024-06-15T17:00:00.000Z'));
    });

    test('converts a ZonedDateTime in winter (CST, UTC-6)', () => {
      // 12:00 CST = 18:00 UTC
      const value = parseZonedDateTime('2024-01-15T12:00:00-06:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      expect(result.value).toStrictEqual(Temporal.Instant.from('2024-01-15T18:00:00.000Z'));
    });

    test('converts a ZonedDateTime just before DST spring-forward (01:59:59 CST)', () => {
      // America/Chicago springs forward at 2:00 AM CST on March 10 2024
      const value = parseZonedDateTime('2024-03-10T01:59:59-06:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      expect(result.value).toStrictEqual(Temporal.Instant.from('2024-03-10T07:59:59.000Z'));
    });

    test('converts a ZonedDateTime just after DST spring-forward (03:00:00 CDT)', () => {
      const value = parseZonedDateTime('2024-03-10T03:00:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      expect(result.value).toStrictEqual(Temporal.Instant.from('2024-03-10T08:00:00.000Z'));
    });

    test('converts a ZonedDateTime during DST fall-back (first 01:30, CDT, UTC-5)', () => {
      // Clocks fall back at 2:00 AM CDT → 1:00 AM CST on Nov 3 2024
      const value = parseZonedDateTime('2024-11-03T01:30:00-05:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      // 01:30 CDT (-5) = 06:30 UTC
      expect(result.value).toStrictEqual(Temporal.Instant.from('2024-11-03T06:30:00.000Z'));
    });

    test('converts a ZonedDateTime during DST fall-back (second 01:30, CST, UTC-6)', () => {
      const value = parseZonedDateTime('2024-11-03T01:30:00-06:00[America/Chicago]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      // 01:30 CST (-6) = 07:30 UTC
      expect(result.value).toStrictEqual(Temporal.Instant.from('2024-11-03T07:30:00.000Z'));
    });

    test('converts a ZonedDateTime in Asia/Tokyo (UTC+9)', () => {
      // 09:00 JST (+9) = 00:00 UTC
      const value = parseZonedDateTime('2024-06-15T09:00:00+09:00[Asia/Tokyo]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      expect(result.value).toStrictEqual(Temporal.Instant.from('2024-06-15T00:00:00.000Z'));
    });

    test('converts a ZonedDateTime in Australia/Sydney (AEDT, UTC+11)', () => {
      // 12:00 AEDT (+11) = 01:00 UTC
      const value = parseZonedDateTime('2024-01-15T12:00:00+11:00[Australia/Sydney]');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      expect(result.value).toStrictEqual(Temporal.Instant.from('2024-01-15T01:00:00.000Z'));
    });

    test('converts a ZonedDateTime using ZonedDateTime constructor', () => {
      // new ZonedDateTime(year, month (1-based), day, timezone, offset, hour, min, sec, ms)
      const value = new ZonedDateTime(2024, 6, 15, 'UTC', 0, 12, 0, 0, 0);
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBeTruthy();
      expect(result.value).toStrictEqual(Temporal.Instant.from('2024-06-15T12:00:00.000Z'));
    });
  });

  describe('should pass an existing Temporal.Instant through unchanged', () => {
    const action = toInstant();

    test('passes through a Temporal.Instant', () => {
      const value = Temporal.Instant.from('2024-06-15T12:00:00Z');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues for invalid inputs', () => {
    const action = toInstant('message');
    const baseIssue: Omit<ToInstantIssue<unknown>, 'input' | 'received'> = {
      kind: 'transformation',
      type: 'to_instant',
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
      const value = '2024-06-15T12:00:00Z';
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

    test('for Temporal.ZonedDateTime', () => {
      const value = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
      });
    });
  });
});
