import { renderHook } from 'vitest-browser-react';

import { FormTypeError } from '@thazstack/form-util';

import { Temporal } from '@js-temporal/polyfill';
import { assert, describe, expect, test } from 'vite-plus/test';

import { dayJS } from '#src/dayjs.config';
import { useNormalizeFieldValueDayJS } from '#src/hooks/normalize-field-value-dayjs';

import { NormalizeHookTestUtils } from './normalize-hook-test-utils';

const testZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
const testInstant = Temporal.Instant.from('2024-06-15T12:00:00Z');
const testPlainDateTime = Temporal.PlainDateTime.from('2024-06-15T12:00:00');
const testPlainDate = Temporal.PlainDate.from('2024-06-15');
const testPlainTime = Temporal.PlainTime.from('09:30:00');
const testDayjs = dayJS.utc('2024-06-15T12:00:00Z');

describe('useNormalizeFieldValueDayJS', () => {
  describe('checks for ZonedDateTime', () => {
    test('converts to Dayjs in UTC', async () => {
      const wrapper = NormalizeHookTestUtils.createWrapperComponent({ defaultTestValue: testZonedDateTime });
      const { result } = await renderHook(() => useNormalizeFieldValueDayJS({ timeZone: 'UTC' }), { wrapper });

      assert.isNotNull(result.current);
      assert.isTrue(dayJS.isDayjs(result.current));
      assert.isTrue(result.current.isValid());
      expect(result.current.toISOString()).toBe('2024-06-15T12:00:00.000Z');
      expect(result.current.utcOffset()).toBe(0);
    });

    test('converts to Dayjs in America/New_York', async () => {
      const wrapper = NormalizeHookTestUtils.createWrapperComponent({ defaultTestValue: testZonedDateTime });
      const { result } = await renderHook(() => useNormalizeFieldValueDayJS({ timeZone: 'America/New_York' }), {
        wrapper,
      });

      assert.isNotNull(result.current);
      assert.isTrue(dayJS.isDayjs(result.current));
      assert.isTrue(result.current.isValid());
      expect(result.current.toISOString()).toBe('2024-06-15T12:00:00.000Z');
      expect(result.current.utcOffset()).toBe(-4 * 60);
    });

    test('converts to Dayjs in Europe/Paris', async () => {
      const wrapper = NormalizeHookTestUtils.createWrapperComponent({ defaultTestValue: testZonedDateTime });
      const { result } = await renderHook(() => useNormalizeFieldValueDayJS({ timeZone: 'Europe/Paris' }), { wrapper });

      assert.isNotNull(result.current);
      assert.isTrue(dayJS.isDayjs(result.current));
      assert.isTrue(result.current.isValid());
      expect(result.current.toISOString()).toBe('2024-06-15T12:00:00.000Z');
      expect(result.current.utcOffset()).toBe(2 * 60);
    });
  });

  describe('checks for Instant', () => {
    test('converts to Dayjs in UTC', async () => {
      const wrapper = NormalizeHookTestUtils.createWrapperComponent({ defaultTestValue: testInstant });
      const { result } = await renderHook(() => useNormalizeFieldValueDayJS({ timeZone: 'UTC' }), { wrapper });

      assert.isNotNull(result.current);
      assert.isTrue(dayJS.isDayjs(result.current));
      assert.isTrue(result.current.isValid());
      expect(result.current.toISOString()).toBe('2024-06-15T12:00:00.000Z');
      expect(result.current.utcOffset()).toBe(0);
    });

    test('converts to Dayjs in America/New_York', async () => {
      const wrapper = NormalizeHookTestUtils.createWrapperComponent({ defaultTestValue: testInstant });
      const { result } = await renderHook(() => useNormalizeFieldValueDayJS({ timeZone: 'America/New_York' }), {
        wrapper,
      });

      assert.isNotNull(result.current);
      assert.isTrue(dayJS.isDayjs(result.current));
      assert.isTrue(result.current.isValid());
      expect(result.current.toISOString()).toBe('2024-06-15T12:00:00.000Z');
      expect(result.current.utcOffset()).toBe(-4 * 60);
    });

    test('converts to Dayjs in Europe/Paris', async () => {
      const wrapper = NormalizeHookTestUtils.createWrapperComponent({ defaultTestValue: testInstant });
      const { result } = await renderHook(() => useNormalizeFieldValueDayJS({ timeZone: 'Europe/Paris' }), { wrapper });

      assert.isNotNull(result.current);
      assert.isTrue(dayJS.isDayjs(result.current));
      assert.isTrue(result.current.isValid());
      expect(result.current.toISOString()).toBe('2024-06-15T12:00:00.000Z');
      expect(result.current.utcOffset()).toBe(2 * 60);
    });
  });

  describe('checks for PlainDateTime', () => {
    test('converts to Dayjs in UTC', async () => {
      const wrapper = NormalizeHookTestUtils.createWrapperComponent({ defaultTestValue: testPlainDateTime });
      const { result } = await renderHook(() => useNormalizeFieldValueDayJS({ timeZone: 'UTC' }), { wrapper });

      assert.isNotNull(result.current);
      assert.isTrue(dayJS.isDayjs(result.current));
      assert.isTrue(result.current.isValid());
      expect(result.current.toISOString()).toBe('2024-06-15T12:00:00.000Z');
      expect(result.current.utcOffset()).toBe(0);
    });

    test('converts to Dayjs in America/New_York', async () => {
      const wrapper = NormalizeHookTestUtils.createWrapperComponent({ defaultTestValue: testPlainDateTime });
      const { result } = await renderHook(() => useNormalizeFieldValueDayJS({ timeZone: 'America/New_York' }), {
        wrapper,
      });

      assert.isNotNull(result.current);
      assert.isTrue(dayJS.isDayjs(result.current));
      assert.isTrue(result.current.isValid());
      expect(result.current.toISOString()).toBe('2024-06-15T16:00:00.000Z');
      expect(result.current.utcOffset()).toBe(-4 * 60);
    });

    test('converts to Dayjs in Europe/Paris', async () => {
      const wrapper = NormalizeHookTestUtils.createWrapperComponent({ defaultTestValue: testPlainDateTime });
      const { result } = await renderHook(() => useNormalizeFieldValueDayJS({ timeZone: 'Europe/Paris' }), { wrapper });

      assert.isNotNull(result.current);
      assert.isTrue(dayJS.isDayjs(result.current));
      assert.isTrue(result.current.isValid());
      expect(result.current.toISOString()).toBe('2024-06-15T10:00:00.000Z');
      expect(result.current.utcOffset()).toBe(2 * 60);
    });
  });

  describe('checks for PlainDate', () => {
    test('converts to Dayjs in UTC', async () => {
      const wrapper = NormalizeHookTestUtils.createWrapperComponent({ defaultTestValue: testPlainDate });
      const { result } = await renderHook(() => useNormalizeFieldValueDayJS({ timeZone: 'UTC' }), { wrapper });

      assert.isNotNull(result.current);
      assert.isTrue(dayJS.isDayjs(result.current));
      assert.isTrue(result.current.isValid());
      expect(result.current.year()).toBe(2024);
      expect(result.current.month()).toBe(5);
      expect(result.current.date()).toBe(15);
      expect(result.current.utcOffset()).toBe(0);
    });

    test('converts to Dayjs in America/New_York', async () => {
      const wrapper = NormalizeHookTestUtils.createWrapperComponent({ defaultTestValue: testPlainDate });
      const { result } = await renderHook(() => useNormalizeFieldValueDayJS({ timeZone: 'America/New_York' }), {
        wrapper,
      });

      assert.isNotNull(result.current);
      assert.isTrue(dayJS.isDayjs(result.current));
      assert.isTrue(result.current.isValid());
      expect(result.current.year()).toBe(2024);
      expect(result.current.month()).toBe(5);
      expect(result.current.date()).toBe(15);
      expect(result.current.utcOffset()).toBe(-4 * 60);
    });

    test('converts to Dayjs in Europe/Paris', async () => {
      const wrapper = NormalizeHookTestUtils.createWrapperComponent({ defaultTestValue: testPlainDate });
      const { result } = await renderHook(() => useNormalizeFieldValueDayJS({ timeZone: 'Europe/Paris' }), { wrapper });

      assert.isNotNull(result.current);
      assert.isTrue(dayJS.isDayjs(result.current));
      assert.isTrue(result.current.isValid());
      expect(result.current.year()).toBe(2024);
      expect(result.current.month()).toBe(5);
      expect(result.current.date()).toBe(15);
      expect(result.current.utcOffset()).toBe(2 * 60);
    });
  });

  describe('checks for PlainTime', () => {
    test('converts to Dayjs in UTC', async () => {
      const wrapper = NormalizeHookTestUtils.createWrapperComponent({ defaultTestValue: testPlainTime });
      const { result } = await renderHook(() => useNormalizeFieldValueDayJS({ timeZone: 'UTC' }), { wrapper });

      assert.isNotNull(result.current);
      assert.isTrue(dayJS.isDayjs(result.current));
      assert.isTrue(result.current.isValid());
      expect(result.current.hour()).toBe(9);
      expect(result.current.minute()).toBe(30);
      expect(result.current.second()).toBe(0);
      expect(result.current.millisecond()).toBe(0);
      expect(result.current.utcOffset()).toBe(0);
    });

    test('converts to Dayjs in America/New_York', async () => {
      const wrapper = NormalizeHookTestUtils.createWrapperComponent({ defaultTestValue: testPlainTime });
      const { result } = await renderHook(() => useNormalizeFieldValueDayJS({ timeZone: 'America/New_York' }), {
        wrapper,
      });

      assert.isNotNull(result.current);
      assert.isTrue(dayJS.isDayjs(result.current));
      assert.isTrue(result.current.isValid());
      expect(result.current.hour()).toBe(9);
      expect(result.current.minute()).toBe(30);
      expect(result.current.second()).toBe(0);
      expect(result.current.millisecond()).toBe(0);
      expect(result.current.utcOffset()).toBe(-4 * 60);
    });

    test('converts to Dayjs in Europe/Paris', async () => {
      const wrapper = NormalizeHookTestUtils.createWrapperComponent({ defaultTestValue: testPlainTime });
      const { result } = await renderHook(() => useNormalizeFieldValueDayJS({ timeZone: 'Europe/Paris' }), { wrapper });

      assert.isNotNull(result.current);
      assert.isTrue(dayJS.isDayjs(result.current));
      assert.isTrue(result.current.isValid());
      expect(result.current.hour()).toBe(9);
      expect(result.current.minute()).toBe(30);
      expect(result.current.second()).toBe(0);
      expect(result.current.millisecond()).toBe(0);
      expect(result.current.utcOffset()).toBe(2 * 60);
    });
  });

  describe('checks for DayJS', () => {
    test('converts to Dayjs in UTC', async () => {
      const wrapper = NormalizeHookTestUtils.createWrapperComponent({ defaultTestValue: testDayjs });
      const { result } = await renderHook(() => useNormalizeFieldValueDayJS({ timeZone: 'UTC' }), { wrapper });

      assert.isNotNull(result.current);
      assert.isTrue(dayJS.isDayjs(result.current));
      assert.isTrue(result.current.isValid());
      expect(result.current.toISOString()).toBe('2024-06-15T12:00:00.000Z');
      expect(result.current.utcOffset()).toBe(0);
    });

    test('converts to Dayjs in America/New_York', async () => {
      const wrapper = NormalizeHookTestUtils.createWrapperComponent({ defaultTestValue: testDayjs });
      const { result } = await renderHook(() => useNormalizeFieldValueDayJS({ timeZone: 'America/New_York' }), {
        wrapper,
      });

      assert.isNotNull(result.current);
      assert.isTrue(dayJS.isDayjs(result.current));
      assert.isTrue(result.current.isValid());
      expect(result.current.toISOString()).toBe('2024-06-15T16:00:00.000Z');
      expect(result.current.utcOffset()).toBe(-4 * 60);
    });

    test('converts to Dayjs in Europe/Paris', async () => {
      const wrapper = NormalizeHookTestUtils.createWrapperComponent({ defaultTestValue: testDayjs });
      const { result } = await renderHook(() => useNormalizeFieldValueDayJS({ timeZone: 'Europe/Paris' }), { wrapper });

      assert.isNotNull(result.current);
      assert.isTrue(dayJS.isDayjs(result.current));
      assert.isTrue(result.current.isValid());
      expect(result.current.toISOString()).toBe('2024-06-15T10:00:00.000Z');
      expect(result.current.utcOffset()).toBe(2 * 60);
    });

    test('values that already have a timezone should convert to new zone but have same ISO point in time', async () => {
      const defaultTestValue = testDayjs.tz('Europe/Paris', true);

      assert.isNotNull(defaultTestValue);
      assert.isTrue(dayJS.isDayjs(defaultTestValue));
      assert.isTrue(defaultTestValue.isValid());
      expect(defaultTestValue.toISOString()).toBe('2024-06-15T10:00:00.000Z');

      const wrapper = NormalizeHookTestUtils.createWrapperComponent({ defaultTestValue });
      const { result, rerender } = await renderHook(
        (initialProps) => {
          assert.isDefined(initialProps);
          return useNormalizeFieldValueDayJS(initialProps);
        },
        {
          wrapper,
          initialProps: { timeZone: 'Europe/Paris' },
        },
      );

      assert.isNotNull(result.current);
      assert.isTrue(dayJS.isDayjs(result.current));
      assert.isTrue(result.current.isValid());
      expect(result.current.toISOString()).toBe('2024-06-15T10:00:00.000Z');
      expect(result.current.utcOffset()).toBe(2 * 60);

      await rerender({ timeZone: 'America/New_York' });

      assert.isNotNull(result.current);
      assert.isTrue(dayJS.isDayjs(result.current));
      assert.isTrue(result.current.isValid());
      expect(result.current.toISOString()).toBe('2024-06-15T16:00:00.000Z');
      expect(result.current.utcOffset()).toBe(-4 * 60);
    });
  });

  test('returns null for null', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({ defaultTestValue: null });
    const { result } = await renderHook(() => useNormalizeFieldValueDayJS({ timeZone: 'UTC' }), { wrapper });

    expect(result.current).toBeNull();
  });

  test('returns null for undefined', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({ defaultTestValue: undefined });
    const { result } = await renderHook(() => useNormalizeFieldValueDayJS({ timeZone: 'UTC' }), { wrapper });

    expect(result.current).toBeNull();
  });

  test('throws FormTypeError for a string field value', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({ defaultTestValue: '' });
    await expect(renderHook(() => useNormalizeFieldValueDayJS({ timeZone: 'UTC' }), { wrapper })).rejects.toThrow(
      FormTypeError,
    );
  });

  test('throws FormTypeError for a number field value', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({ defaultTestValue: 5 });
    await expect(renderHook(() => useNormalizeFieldValueDayJS({ timeZone: 'UTC' }), { wrapper })).rejects.toThrow(
      FormTypeError,
    );
  });

  test('throws FormTypeError for an object field value', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({ defaultTestValue: {} });
    await expect(renderHook(() => useNormalizeFieldValueDayJS({ timeZone: 'UTC' }), { wrapper })).rejects.toThrow(
      FormTypeError,
    );
  });
});
