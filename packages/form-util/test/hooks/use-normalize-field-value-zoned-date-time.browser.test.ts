import { renderHook } from 'vitest-browser-react';

import { Temporal } from '@js-temporal/polyfill';
import { assert, describe, expect, test } from 'vite-plus/test';

import { FormTypeError } from '#src/error';
import { useNormalizeFieldValueZonedDateTime } from '#src/hooks/normalize-field-value-zoned-date-time';
import { NormalizeHookTestUtils } from '#test/normalize-hook-test-utils';

const testZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T12:00:00-04:00[America/New_York]');
const testInstant = Temporal.Instant.from('2024-06-15T16:00:00Z');
const testPlainDateTime = Temporal.PlainDateTime.from('2024-06-15T12:00:00');
const testPlainDate = Temporal.PlainDate.from('2024-06-15');
const testPlainTime = Temporal.PlainTime.from('12:00:00');

describe('useNormalizeFieldValueZonedDateTime', () => {
  test('returns a ZonedDateTime value unchanged', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent(testZonedDateTime);

    const { result } = await renderHook(() => useNormalizeFieldValueZonedDateTime(), { wrapper });

    assert(result.current !== null);
    expect(testZonedDateTime.equals(result.current)).toBeTruthy();
  });

  test('returns null for null', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent(null);

    const { result } = await renderHook(() => useNormalizeFieldValueZonedDateTime(), { wrapper });
    expect(result.current).toBeNull();
  });

  test('returns null for undefined', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent(undefined);

    const { result } = await renderHook(() => useNormalizeFieldValueZonedDateTime(), { wrapper });
    expect(result.current).toBeNull();
  });

  test('throws FormTypeError for a Temporal.Instant field value', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent(testInstant);

    await expect(renderHook(() => useNormalizeFieldValueZonedDateTime(), { wrapper })).rejects.toThrow(FormTypeError);
  });

  test('throws FormTypeError for a Temporal.PlainDateTime field value', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent(testPlainDateTime);

    await expect(renderHook(() => useNormalizeFieldValueZonedDateTime(), { wrapper })).rejects.toThrow(FormTypeError);
  });

  test('throws FormTypeError for a Temporal.PlainDate field value', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent(testPlainDate);

    await expect(renderHook(() => useNormalizeFieldValueZonedDateTime(), { wrapper })).rejects.toThrow(FormTypeError);
  });

  test('throws FormTypeError for a string field value', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent('');

    await expect(renderHook(() => useNormalizeFieldValueZonedDateTime(), { wrapper })).rejects.toThrow(FormTypeError);
  });

  test('throws FormTypeError for a number field value', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent(5);

    await expect(renderHook(() => useNormalizeFieldValueZonedDateTime(), { wrapper })).rejects.toThrow(FormTypeError);
  });

  test('throws FormTypeError for a Temporal.PlainTime field value', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent(testPlainTime);

    await expect(renderHook(() => useNormalizeFieldValueZonedDateTime(), { wrapper })).rejects.toThrow(FormTypeError);
  });

  test('throws FormTypeError for an object field value', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent({});

    await expect(renderHook(() => useNormalizeFieldValueZonedDateTime(), { wrapper })).rejects.toThrow(FormTypeError);
  });
});
