import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vitest';

import type { ToInstantAction } from '#src/actions/to-instant-value';
import type { ToInstantIssue } from '@thazstack/temporal-valibot-util';

import { toInstant } from '#src/actions/to-instant-value';
import { dayJS } from '#src/dayjs.config';

describe('toInstant', () => {
  describe('should return action object', () => {
    it('with undefined message', () => {
      expect(toInstant()).toStrictEqual({
        kind: 'transformation',
        type: 'to_instant',
        reference: toInstant,
        async: false,
        message: undefined,
        '~run': expect.any(Function),
      } satisfies ToInstantAction<unknown, undefined>);
    });

    it('with string message', () => {
      expect(toInstant('message')).toStrictEqual({
        kind: 'transformation',
        type: 'to_instant',
        reference: toInstant,
        async: false,
        message: 'message',
        '~run': expect.any(Function),
      } satisfies ToInstantAction<unknown, string>);
    });

    it('with function message', () => {
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

  describe('should convert DayJS to Temporal.Instant', () => {
    const action = toInstant();

    it('converts a UTC DayJS', () => {
      const value = dayJS.utc('2024-06-15T12:00:00Z');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      expect(result.value).toEqual(Temporal.Instant.from('2024-06-15T12:00:00.000Z'));
    });

    it('converts a summer DayJS in America/Chicago (CDT, UTC-5)', () => {
      const value = dayJS.tz('2024-06-15T12:00:00', 'America/Chicago');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      // 12:00 CDT = 17:00 UTC
      expect(result.value).toEqual(Temporal.Instant.from('2024-06-15T17:00:00.000Z'));
    });

    it('converts a winter DayJS in America/Chicago (CST, UTC-6)', () => {
      const value = dayJS.tz('2024-01-15T12:00:00', 'America/Chicago');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      // 12:00 CST = 18:00 UTC
      expect(result.value).toEqual(Temporal.Instant.from('2024-01-15T18:00:00.000Z'));
    });

    it('converts a DayJS just before DST spring-forward (01:59:59 CST)', () => {
      // America/Chicago springs forward from 2:00 AM CST to 3:00 AM CDT on March 10 2024
      const value = dayJS.utc('2024-03-10T07:59:59Z'); // = 01:59:59 CST
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      expect(result.value).toEqual(Temporal.Instant.from('2024-03-10T07:59:59.000Z'));
    });

    it('converts a DayJS just after DST spring-forward (03:00:00 CDT)', () => {
      const value = dayJS.utc('2024-03-10T08:00:00Z'); // = 03:00:00 CDT
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      expect(result.value).toEqual(Temporal.Instant.from('2024-03-10T08:00:00.000Z'));
    });

    it('converts a DayJS during DST fall-back (first 01:30, CDT, UTC-5)', () => {
      // Clocks fall back at 2:00 AM CDT → 1:00 AM CST on Nov 3 2024
      const value = dayJS.utc('2024-11-03T06:30:00Z').tz('America/Chicago'); // 01:30 CDT
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      expect(result.value).toEqual(Temporal.Instant.from('2024-11-03T06:30:00.000Z'));
    });

    it('converts a DayJS after DST fall-back (02:30 CST, unambiguous, UTC-6)', () => {
      // 01:30 AM is ambiguous during fall-back; use 02:30 CST which is unambiguous
      const value = dayJS.tz('2024-11-03T02:30:00', 'America/Chicago'); // 02:30 CST
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      // 02:30 CST = 08:30 UTC
      expect(result.value).toEqual(Temporal.Instant.from('2024-11-03T08:30:00.000Z'));
    });

    it('converts a DayJS in Australia/Sydney (AEDT, UTC+11) during southern hemisphere summer', () => {
      const value = dayJS.tz('2024-01-15T12:00:00', 'Australia/Sydney');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      // 12:00 AEDT (+11) = 01:00 UTC
      expect(result.value).toEqual(Temporal.Instant.from('2024-01-15T01:00:00.000Z'));
    });

    it('converts a DayJS at epoch zero', () => {
      const value = dayJS.utc(0);
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      expect(result.value).toEqual(Temporal.Instant.fromEpochMilliseconds(0));
    });

    it('converts a DayJS at the last ms before DST spring-forward gap (07:59:59.999 UTC)', () => {
      // The gap on 2024-03-10: clocks skip 02:00 CST → 03:00 CDT.
      // 07:59:59.999 UTC is the final instant in CST (-06:00); 08:00:00.000 UTC is the first in CDT (-05:00).
      const value = dayJS.utc('2024-03-10T07:59:59.999Z');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      expect(result.value).toEqual(Temporal.Instant.from('2024-03-10T07:59:59.999Z'));
    });
  });

  describe('should pass an existing Temporal.Instant through unchanged', () => {
    const action = toInstant();

    it('passes through a Temporal.Instant', () => {
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
