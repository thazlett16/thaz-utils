import { Temporal } from '@js-temporal/polyfill';
import type { Dayjs } from 'dayjs';
import { describe, expect, it } from 'vitest';

import { normalizeFieldValueDayJS } from '#src/hooks/normalize-field-value-dayjs';
import { dayJS } from '#src/dayjs.config';
import { FormTypeError } from '#src/error';

describe('normalizeFieldValueDayJS', () => {
  describe('should convert Temporal.ZonedDateTime to a timezone-aware DayJS', () => {
    it('converts a UTC ZonedDateTime (summer, CDT) — DST case', () => {
      // 17:00 UTC should be 12:00 CDT (UTC-5)
      const zdt = Temporal.ZonedDateTime.from('2024-06-15T17:00:00+00:00[UTC]');
      const djs = normalizeFieldValueDayJS(zdt, { timeZone: 'America/Chicago' });
      expect(djs).not.toBeNull();
      expect((djs as Dayjs).hour()).toBe(12);
      expect((djs as Dayjs).utcOffset()).toBe(-5 * 60);
    });

    it('converts a UTC ZonedDateTime (winter, CST) — standard time case', () => {
      // 18:00 UTC should be 12:00 CST (UTC-6)
      const zdt = Temporal.ZonedDateTime.from('2024-01-15T18:00:00+00:00[UTC]');
      const djs = normalizeFieldValueDayJS(zdt, { timeZone: 'America/Chicago' });
      expect(djs).not.toBeNull();
      expect((djs as Dayjs).hour()).toBe(12);
      expect((djs as Dayjs).utcOffset()).toBe(-6 * 60);
    });

    it('converts a ZonedDateTime with a positive UTC offset (Asia/Tokyo, UTC+9)', () => {
      const zdt = Temporal.ZonedDateTime.from('2024-06-15T09:00:00+09:00[Asia/Tokyo]');
      const djs = normalizeFieldValueDayJS(zdt, { timeZone: 'Asia/Tokyo' });
      expect(djs).not.toBeNull();
      expect((djs as Dayjs).hour()).toBe(9);
    });
  });

  describe('should convert Temporal.Instant to a timezone-aware DayJS', () => {
    it('converts a Temporal.Instant at summer UTC (CDT, UTC-5)', () => {
      // 17:00 UTC → 12:00 CDT
      const inst = Temporal.Instant.from('2024-06-15T17:00:00Z');
      const djs = normalizeFieldValueDayJS(inst, { timeZone: 'America/Chicago' });
      expect(djs).not.toBeNull();
      expect((djs as Dayjs).hour()).toBe(12);
      expect((djs as Dayjs).utcOffset()).toBe(-5 * 60);
    });

    it('converts a Temporal.Instant at winter UTC (CST, UTC-6)', () => {
      // 18:00 UTC → 12:00 CST
      const inst = Temporal.Instant.from('2024-01-15T18:00:00Z');
      const djs = normalizeFieldValueDayJS(inst, { timeZone: 'America/Chicago' });
      expect(djs).not.toBeNull();
      expect((djs as Dayjs).hour()).toBe(12);
      expect((djs as Dayjs).utcOffset()).toBe(-6 * 60);
    });

    it('converts a Temporal.Instant at the UTC epoch', () => {
      const inst = Temporal.Instant.fromEpochMilliseconds(0);
      const djs = normalizeFieldValueDayJS(inst, { timeZone: 'UTC' });
      expect(djs).not.toBeNull();
      expect((djs as Dayjs).utc().toISOString()).toBe('1970-01-01T00:00:00.000Z');
    });
  });

  describe('should convert Temporal.PlainDateTime to a timezone-aware DayJS', () => {
    it('converts a Temporal.PlainDateTime preserving wall-clock components', () => {
      const pdt = Temporal.PlainDateTime.from('2024-06-15T09:30:45');
      const djs = normalizeFieldValueDayJS(pdt, { timeZone: 'America/Chicago' });
      expect(djs).not.toBeNull();
      expect((djs as Dayjs).year()).toBe(2024);
      expect((djs as Dayjs).month()).toBe(5); // June in 0-indexed dayjs
      expect((djs as Dayjs).date()).toBe(15);
      expect((djs as Dayjs).hour()).toBe(9);
    });

    it('converts a Temporal.PlainDateTime preserving minutes/seconds/milliseconds', () => {
      const pdt = Temporal.PlainDateTime.from('2024-06-15T09:30:45.123');
      const djs = normalizeFieldValueDayJS(pdt, { timeZone: 'America/Chicago' });
      expect(djs).not.toBeNull();
      expect((djs as Dayjs).minute()).toBe(30);
      expect((djs as Dayjs).second()).toBe(45);
      expect((djs as Dayjs).millisecond()).toBe(123);
    });

    it('converts a Temporal.PlainDateTime in December — month index boundary (12 → 11)', () => {
      const pdt = Temporal.PlainDateTime.from('2023-12-31T23:59:59');
      const djs = normalizeFieldValueDayJS(pdt, { timeZone: 'UTC' });
      expect(djs).not.toBeNull();
      expect((djs as Dayjs).year()).toBe(2023);
      expect((djs as Dayjs).month()).toBe(11); // December = 11 in 0-indexed dayjs
      expect((djs as Dayjs).date()).toBe(31);
    });
  });

  describe('should convert Temporal.PlainDate to a timezone-aware DayJS', () => {
    it('converts a Temporal.PlainDate preserving year/month/day', () => {
      const pd = Temporal.PlainDate.from('2024-06-15');
      const djs = normalizeFieldValueDayJS(pd, { timeZone: 'America/Chicago' });
      expect(djs).not.toBeNull();
      expect((djs as Dayjs).year()).toBe(2024);
      expect((djs as Dayjs).month()).toBe(5); // June in 0-indexed dayjs
      expect((djs as Dayjs).date()).toBe(15);
    });

    it('converts a Temporal.PlainDate at year boundary', () => {
      const pd = Temporal.PlainDate.from('2024-01-01');
      const djs = normalizeFieldValueDayJS(pd, { timeZone: 'UTC' });
      expect(djs).not.toBeNull();
      expect((djs as Dayjs).year()).toBe(2024);
      expect((djs as Dayjs).month()).toBe(0); // January = 0
      expect((djs as Dayjs).date()).toBe(1);
    });

    it('converts a Temporal.PlainDate at Dec 31 — month index boundary (12 → 11)', () => {
      const pd = Temporal.PlainDate.from('2023-12-31');
      const djs = normalizeFieldValueDayJS(pd, { timeZone: 'UTC' });
      expect(djs).not.toBeNull();
      expect((djs as Dayjs).year()).toBe(2023);
      expect((djs as Dayjs).month()).toBe(11); // December = 11
      expect((djs as Dayjs).date()).toBe(31);
    });
  });

  describe('should convert Temporal.PlainTime to a timezone-aware DayJS', () => {
    it('converts a Temporal.PlainTime preserving all time components', () => {
      const pt = Temporal.PlainTime.from('09:30:45.123');
      const djs = normalizeFieldValueDayJS(pt, { timeZone: 'America/Chicago' });
      expect(djs).not.toBeNull();
      expect((djs as Dayjs).hour()).toBe(9);
      expect((djs as Dayjs).minute()).toBe(30);
      expect((djs as Dayjs).second()).toBe(45);
      expect((djs as Dayjs).millisecond()).toBe(123);
    });

    it('converts midnight (00:00:00)', () => {
      const pt = Temporal.PlainTime.from('00:00:00');
      const djs = normalizeFieldValueDayJS(pt, { timeZone: 'UTC' });
      expect(djs).not.toBeNull();
      expect((djs as Dayjs).hour()).toBe(0);
      expect((djs as Dayjs).minute()).toBe(0);
      expect((djs as Dayjs).second()).toBe(0);
    });

    it('converts end-of-day (23:59:59.999)', () => {
      const pt = Temporal.PlainTime.from('23:59:59.999');
      const djs = normalizeFieldValueDayJS(pt, { timeZone: 'UTC' });
      expect(djs).not.toBeNull();
      expect((djs as Dayjs).hour()).toBe(23);
      expect((djs as Dayjs).minute()).toBe(59);
      expect((djs as Dayjs).second()).toBe(59);
      expect((djs as Dayjs).millisecond()).toBe(999);
    });
  });

  describe('should pass an existing DayJS through unchanged', () => {
    it('passes through a UTC DayJS', () => {
      const value = dayJS.utc('2024-06-15T12:00:00Z');
      const result = normalizeFieldValueDayJS(value, { timeZone: 'America/Chicago' });
      expect(result).toBe(value);
    });

    it('passes through a timezone-aware DayJS', () => {
      const value = dayJS.tz('2024-06-15T12:00:00', 'America/Chicago');
      const result = normalizeFieldValueDayJS(value, { timeZone: 'America/Chicago' });
      expect(result).toBe(value);
    });
  });

  describe('should return null for null/undefined', () => {
    it('returns null for null', () => {
      expect(normalizeFieldValueDayJS(null, { timeZone: 'UTC' })).toBeNull();
    });

    it('returns null for undefined', () => {
      expect(normalizeFieldValueDayJS(undefined, { timeZone: 'UTC' })).toBeNull();
    });
  });

  describe('should throw FormTypeError for invalid types', () => {
    it('throws FormTypeError for a string value', () => {
      expect(() =>
        normalizeFieldValueDayJS('2024-06-15T12:00:00Z' as never, { timeZone: 'UTC' }),
      ).toThrow(FormTypeError);
    });

    it('throws FormTypeError for a number value', () => {
      expect(() =>
        normalizeFieldValueDayJS(1718452800000 as never, { timeZone: 'UTC' }),
      ).toThrow(FormTypeError);
    });
  });
});
