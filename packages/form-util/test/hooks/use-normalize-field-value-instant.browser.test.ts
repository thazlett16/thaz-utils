import { renderHook } from 'vitest-browser-react';

import { Temporal } from '@js-temporal/polyfill';
import { assert, describe, expect, test } from 'vite-plus/test';

import { FormTypeError } from '#src/form-error';
import { useNormalizeFieldValueInstant } from '#src/hooks/normalize-field-value-instant';

import { NormalizeHookTestUtils } from './normalize-hook-test-utils';

const testZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T12:00:00-04:00[America/New_York]');
const testInstant = Temporal.Instant.from('2024-06-15T16:00:00Z');
const testPlainDateTime = Temporal.PlainDateTime.from('2024-06-15T12:00:00');
const testPlainDate = Temporal.PlainDate.from('2024-06-15');
const testPlainTime = Temporal.PlainTime.from('12:00:00');

describe('useNormalizeFieldValueInstant', () => {
  test('returns an Instant value unchanged', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({
      defaultTestValue: testInstant,
    });

    const { result } = await renderHook(() => useNormalizeFieldValueInstant(), { wrapper });

    assert.isNotNull(result.current);
    expect(testInstant.equals(result.current)).toBeTruthy();
  });

  test('returns an Instant value for ZonedDateTime', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({
      defaultTestValue: testZonedDateTime,
    });

    const { result } = await renderHook(() => useNormalizeFieldValueInstant(), { wrapper });

    assert.isNotNull(result.current);
    expect(testInstant.equals(result.current)).toBeTruthy();
  });

  test('returns null for null', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({
      defaultTestValue: null,
    });

    const { result } = await renderHook(() => useNormalizeFieldValueInstant(), { wrapper });
    expect(result.current).toBeNull();
  });

  test('returns null for undefined', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({
      defaultTestValue: undefined,
    });

    const { result } = await renderHook(() => useNormalizeFieldValueInstant(), { wrapper });
    expect(result.current).toBeNull();
  });

  test('throws FormTypeError for a string field value', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({
      defaultTestValue: '',
    });

    await expect(renderHook(() => useNormalizeFieldValueInstant(), { wrapper })).rejects.toThrow(FormTypeError);
  });

  test('throws FormTypeError for a number field value', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({
      defaultTestValue: 5,
    });

    await expect(renderHook(() => useNormalizeFieldValueInstant(), { wrapper })).rejects.toThrow(FormTypeError);
  });

  test('throws FormTypeError for a object field value', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({
      defaultTestValue: {},
    });

    await expect(renderHook(() => useNormalizeFieldValueInstant(), { wrapper })).rejects.toThrow(FormTypeError);
  });

  test('throws FormTypeError for a PlainDateTime field value', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({
      defaultTestValue: testPlainDateTime,
    });

    await expect(renderHook(() => useNormalizeFieldValueInstant(), { wrapper })).rejects.toThrow(FormTypeError);
  });

  test('throws FormTypeError for a PlainDate field value', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({
      defaultTestValue: testPlainDate,
    });

    await expect(renderHook(() => useNormalizeFieldValueInstant(), { wrapper })).rejects.toThrow(FormTypeError);
  });

  test('throws FormTypeError for a PlainTime field value', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({
      defaultTestValue: testPlainTime,
    });

    await expect(renderHook(() => useNormalizeFieldValueInstant(), { wrapper })).rejects.toThrow(FormTypeError);
  });
});
