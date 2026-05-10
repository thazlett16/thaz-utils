import { renderHook } from 'vitest-browser-react';

import { Temporal } from '@js-temporal/polyfill';
import { assert, describe, expect, test } from 'vite-plus/test';

import { FormTypeError } from '#src/error';
import { useNormalizeFieldValuePlainDate } from '#src/hooks/normalize-field-value-plain-date';

import { NormalizeHookTestUtils } from './normalize-hook-test-utils';

const testZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T12:00:00-04:00[America/New_York]');
const testInstant = Temporal.Instant.from('2024-06-15T16:00:00Z');
const testPlainDateTime = Temporal.PlainDateTime.from('2024-06-15T12:00:00');
const testPlainDate = Temporal.PlainDate.from('2024-06-15');
const testPlainTime = Temporal.PlainTime.from('12:00:00');

describe('useNormalizeFieldValuePlainDate', () => {
  test('returns a PlainDate value unchanged', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent(testPlainDate);

    const { result } = await renderHook(() => useNormalizeFieldValuePlainDate(), { wrapper });

    assert(result.current !== null);
    expect(testPlainDate.equals(result.current)).toBeTruthy();
  });

  test('returns a PlainDate value for ZonedDateTime', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent(testZonedDateTime);

    const { result } = await renderHook(() => useNormalizeFieldValuePlainDate(), { wrapper });

    assert(result.current !== null);
    expect(testPlainDate.equals(result.current)).toBeTruthy();
  });

  test('returns a PlainDate value for PlainDateTime', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent(testPlainDateTime);

    const { result } = await renderHook(() => useNormalizeFieldValuePlainDate(), { wrapper });

    assert(result.current !== null);
    expect(testPlainDate.equals(result.current)).toBeTruthy();
  });

  test('returns null for null', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent(null);

    const { result } = await renderHook(() => useNormalizeFieldValuePlainDate(), { wrapper });
    expect(result.current).toBeNull();
  });

  test('returns null for undefined', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent(undefined);

    const { result } = await renderHook(() => useNormalizeFieldValuePlainDate(), { wrapper });
    expect(result.current).toBeNull();
  });

  test('throws FormTypeError for a Temporal.Instant field value', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent(testInstant);

    await expect(renderHook(() => useNormalizeFieldValuePlainDate(), { wrapper })).rejects.toThrow(FormTypeError);
  });

  test('throws FormTypeError for a string field value', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent('');

    await expect(renderHook(() => useNormalizeFieldValuePlainDate(), { wrapper })).rejects.toThrow(FormTypeError);
  });

  test('throws FormTypeError for a number field value', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent(5);

    await expect(renderHook(() => useNormalizeFieldValuePlainDate(), { wrapper })).rejects.toThrow(FormTypeError);
  });

  test('throws FormTypeError for a Temporal.PlainTime field value', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent(testPlainTime);

    await expect(renderHook(() => useNormalizeFieldValuePlainDate(), { wrapper })).rejects.toThrow(FormTypeError);
  });

  test('throws FormTypeError for an object field value', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent({});

    await expect(renderHook(() => useNormalizeFieldValuePlainDate(), { wrapper })).rejects.toThrow(FormTypeError);
  });
});
