import { renderHook } from 'vitest-browser-react';

import { describe, expect, test } from 'vite-plus/test';

import { FormTypeError } from '#src/error';
import { useNormalizeFieldValueNumber } from '#src/hooks/normalize-field-value-number';

import { NormalizeHookTestUtils } from './normalize-hook-test-utils';

describe('useNormalizeFieldValueNumber', () => {
  test('returns a number ( 0 ) value unchanged', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({
      defaultTestValue: 0,
    });

    const { result } = await renderHook(() => useNormalizeFieldValueNumber(), { wrapper });
    expect(result.current).toBe(0);
  });

  test('returns a number ( +1 ) value unchanged', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({
      defaultTestValue: 1,
    });

    const { result } = await renderHook(() => useNormalizeFieldValueNumber(), { wrapper });
    expect(result.current).toBe(1);
  });

  test('returns a number ( -1 ) value unchanged', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({
      defaultTestValue: -1,
    });

    const { result } = await renderHook(() => useNormalizeFieldValueNumber(), { wrapper });
    expect(result.current).toBe(-1);
  });

  test('returns null for null', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({
      defaultTestValue: null,
    });

    const { result } = await renderHook(() => useNormalizeFieldValueNumber(), { wrapper });
    expect(result.current).toBeNull();
  });

  test('returns null for undefined', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({
      defaultTestValue: undefined,
    });

    const { result } = await renderHook(() => useNormalizeFieldValueNumber(), { wrapper });
    expect(result.current).toBeNull();
  });

  test('throws FormTypeError for a string field value', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({
      defaultTestValue: '',
    });

    await expect(renderHook(() => useNormalizeFieldValueNumber(), { wrapper })).rejects.toThrow(FormTypeError);
  });

  test('throws FormTypeError for a object field value', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({
      defaultTestValue: {},
    });

    await expect(renderHook(() => useNormalizeFieldValueNumber(), { wrapper })).rejects.toThrow(FormTypeError);
  });
});
