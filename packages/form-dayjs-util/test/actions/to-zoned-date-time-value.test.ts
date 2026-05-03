import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vitest';

import type { ToZonedDateTimeAction } from '#src/actions/to-zoned-date-time-value';
import type { ToZonedDateTimeIssue } from '@thazstack/temporal-valibot-util';

import { toZonedDateTime } from '#src/actions/to-zoned-date-time-value';
import { dayJS } from '#src/dayjs.config';

describe('toZonedDateTime', () => {
  describe('should return action object', () => {
    it('with undefined message', () => {
      expect(toZonedDateTime({ timeZone: 'UTC' })).toStrictEqual({
        kind: 'transformation',
        type: 'to_zoned_date_time',
        reference: toZonedDateTime,
        async: false,
        message: undefined,
        '~run': expect.any(Function),
      } satisfies ToZonedDateTimeAction<unknown, undefined>);
    });

    it('with string message', () => {
      expect(toZonedDateTime({ timeZone: 'UTC' }, 'message')).toStrictEqual({
        kind: 'transformation',
        type: 'to_zoned_date_time',
        reference: toZonedDateTime,
        async: false,
        message: 'message',
        '~run': expect.any(Function),
      } satisfies ToZonedDateTimeAction<unknown, string>);
    });

    it('with function message', () => {
      const message = () => 'message';
      expect(toZonedDateTime({ timeZone: 'UTC' }, message)).toStrictEqual({
        kind: 'transformation',
        type: 'to_zoned_date_time',
        reference: toZonedDateTime,
        async: false,
        message,
        '~run': expect.any(Function),
      } satisfies ToZonedDateTimeAction<unknown, typeof message>);
    });
  });

  describe('should convert DayJS to Temporal.ZonedDateTime using options.timeZone', () => {
    it('converts a UTC DayJS to UTC ZonedDateTime', () => {
      const action = toZonedDateTime({ timeZone: 'UTC' });
      const value = dayJS.utc('2024-06-15T12:00:00Z');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const zdt = result.value as Temporal.ZonedDateTime;
      expect(zdt.timeZoneId).toBe('UTC');
      expect(zdt.year).toBe(2024);
      expect(zdt.month).toBe(6);
      expect(zdt.day).toBe(15);
      expect(zdt.hour).toBe(12);
      expect(zdt.toInstant().epochMilliseconds).toBe(dayJS.utc('2024-06-15T12:00:00Z').valueOf());
    });

    it('converts a UTC DayJS to America/Chicago ZonedDateTime (CDT, UTC-5)', () => {
      // dayJS UTC value represents a moment; converting to Chicago gives CDT time
      const action = toZonedDateTime({ timeZone: 'America/Chicago' });
      const value = dayJS.utc('2024-06-15T17:00:00Z'); // 17:00 UTC = 12:00 CDT
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const zdt = result.value as Temporal.ZonedDateTime;
      expect(zdt.timeZoneId).toBe('America/Chicago');
      expect(zdt.hour).toBe(12);
      expect(zdt.offset).toBe('-05:00');
    });

    it('converts a UTC DayJS to America/Chicago ZonedDateTime (CST, UTC-6)', () => {
      const action = toZonedDateTime({ timeZone: 'America/Chicago' });
      const value = dayJS.utc('2024-01-15T18:00:00Z'); // 18:00 UTC = 12:00 CST
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const zdt = result.value as Temporal.ZonedDateTime;
      expect(zdt.timeZoneId).toBe('America/Chicago');
      expect(zdt.hour).toBe(12);
      expect(zdt.offset).toBe('-06:00');
    });

    it('converts a DayJS just before DST spring-forward (01:59:59 CST → UTC 07:59:59)', () => {
      // America/Chicago springs forward from 2:00 AM CST to 3:00 AM CDT on March 10 2024
      const action = toZonedDateTime({ timeZone: 'America/Chicago' });
      const value = dayJS.utc('2024-03-10T07:59:59Z'); // = 01:59:59 CST
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const zdt = result.value as Temporal.ZonedDateTime;
      expect(zdt.hour).toBe(1);
      expect(zdt.minute).toBe(59);
      expect(zdt.second).toBe(59);
      expect(zdt.offset).toBe('-06:00');
    });

    it('converts a DayJS just after DST spring-forward (03:00:00 CDT → UTC 08:00:00)', () => {
      const action = toZonedDateTime({ timeZone: 'America/Chicago' });
      const value = dayJS.utc('2024-03-10T08:00:00Z'); // = 03:00:00 CDT
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const zdt = result.value as Temporal.ZonedDateTime;
      expect(zdt.hour).toBe(3);
      expect(zdt.minute).toBe(0);
      expect(zdt.offset).toBe('-05:00');
    });

    it('converts a DayJS during DST fall-back (first 01:30 CDT → UTC 06:30)', () => {
      // Clocks fall back at 2:00 AM CDT → 1:00 AM CST on Nov 3 2024
      const action = toZonedDateTime({ timeZone: 'America/Chicago' });
      const value = dayJS.utc('2024-11-03T06:30:00Z'); // 01:30 CDT
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const zdt = result.value as Temporal.ZonedDateTime;
      expect(zdt.hour).toBe(1);
      expect(zdt.minute).toBe(30);
      expect(zdt.offset).toBe('-05:00');
    });

    it('converts a DayJS during DST fall-back (second 01:30 CST → UTC 07:30)', () => {
      const action = toZonedDateTime({ timeZone: 'America/Chicago' });
      const value = dayJS.utc('2024-11-03T07:30:00Z'); // 01:30 CST
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const zdt = result.value as Temporal.ZonedDateTime;
      expect(zdt.hour).toBe(1);
      expect(zdt.minute).toBe(30);
      expect(zdt.offset).toBe('-06:00');
    });

    it('converts a DayJS with options.timeZone = Asia/Tokyo (UTC+9)', () => {
      const action = toZonedDateTime({ timeZone: 'Asia/Tokyo' });
      const value = dayJS.utc('2024-06-15T00:00:00Z'); // 00:00 UTC = 09:00 JST
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const zdt = result.value as Temporal.ZonedDateTime;
      expect(zdt.timeZoneId).toBe('Asia/Tokyo');
      expect(zdt.hour).toBe(9);
      expect(zdt.offset).toBe('+09:00');
    });

    it('converts a DayJS with options.timeZone = Australia/Sydney (AEDT, UTC+11)', () => {
      const action = toZonedDateTime({ timeZone: 'Australia/Sydney' });
      const value = dayJS.utc('2024-01-15T01:00:00Z'); // 01:00 UTC = 12:00 AEDT
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const zdt = result.value as Temporal.ZonedDateTime;
      expect(zdt.timeZoneId).toBe('Australia/Sydney');
      expect(zdt.hour).toBe(12);
    });

    it('preserves milliseconds in conversion', () => {
      const action = toZonedDateTime({ timeZone: 'UTC' });
      const value = dayJS.utc('2024-06-15T12:00:00.456Z');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const zdt = result.value as Temporal.ZonedDateTime;
      expect(zdt.millisecond).toBe(456);
    });

    it('converts a DayJS at the exact DST spring-forward boundary (07:59:59.999 UTC → 01:59:59.999 CST, last moment before gap)', () => {
      // Clocks skip from 02:00:00 CST to 03:00:00 CDT on 2024-03-10.
      // 07:59:59.999 UTC is the last instant mapped to CST (01:59:59.999 CST, -06:00).
      const action = toZonedDateTime({ timeZone: 'America/Chicago' });
      const value = dayJS.utc('2024-03-10T07:59:59.999Z');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const zdt = result.value as Temporal.ZonedDateTime;
      expect(zdt.hour).toBe(1);
      expect(zdt.minute).toBe(59);
      expect(zdt.second).toBe(59);
      expect(zdt.millisecond).toBe(999);
      expect(zdt.offset).toBe('-06:00');
    });

    it('converts a DayJS 1ms into the DST spring-forward gap boundary (08:00:00 UTC → 03:00:00 CDT)', () => {
      // 08:00:00 UTC is the first instant mapped to CDT (03:00:00 CDT, -05:00).
      // Times 02:00:00-02:59:59 CST do not exist; they are skipped.
      const action = toZonedDateTime({ timeZone: 'America/Chicago' });
      const value = dayJS.utc('2024-03-10T08:00:00.000Z');
      const result = action['~run']({ typed: true, value }, {});
      expect(result.typed).toBe(true);
      const zdt = result.value as Temporal.ZonedDateTime;
      expect(zdt.hour).toBe(3);
      expect(zdt.minute).toBe(0);
      expect(zdt.second).toBe(0);
      expect(zdt.offset).toBe('-05:00');
    });
  });

  describe('should pass an existing Temporal.ZonedDateTime through unchanged', () => {
    const action = toZonedDateTime({ timeZone: 'UTC' });

    it('passes through a Temporal.ZonedDateTime', () => {
      const value = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });

    it('passes through a Temporal.ZonedDateTime with non-UTC timezone', () => {
      const value = Temporal.ZonedDateTime.from('2024-06-15T12:00:00-05:00[America/Chicago]');
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues for invalid inputs', () => {
    const action = toZonedDateTime({ timeZone: 'UTC' }, 'message');
    const baseIssue: Omit<ToZonedDateTimeIssue<unknown>, 'input' | 'received'> = {
      kind: 'transformation',
      type: 'to_zoned_date_time',
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
