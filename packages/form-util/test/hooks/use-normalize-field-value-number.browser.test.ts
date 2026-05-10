import { renderHook } from 'vitest-browser-react';

import { describe, expect, test } from 'vite-plus/test';

import { FormTypeError } from '#src/error';
import { useNormalizeFieldValueNumber } from '#src/hooks/normalize-field-value-number';
import { NormalizeHookTestUtils } from '#test/normalize-hook-test-utils';

describe('useNormalizeFieldValueNumber', () => {
  test('returns a number ( 0 ) value unchanged', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent(0);

    const { result } = await renderHook(() => useNormalizeFieldValueNumber(), { wrapper });
    expect(result.current).toBe(0);
  });

  test('returns a number ( +1 ) value unchanged', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent(1);

    const { result } = await renderHook(() => useNormalizeFieldValueNumber(), { wrapper });
    expect(result.current).toBe(1);
  });

  test('returns a number ( -1 ) value unchanged', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent(-1);

    const { result } = await renderHook(() => useNormalizeFieldValueNumber(), { wrapper });
    expect(result.current).toBe(-1);
  });

  test('returns null for null', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent(null);

    const { result } = await renderHook(() => useNormalizeFieldValueNumber(), { wrapper });
    expect(result.current).toBeNull();
  });

  test('returns null for undefined', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent(undefined);

    const { result } = await renderHook(() => useNormalizeFieldValueNumber(), { wrapper });
    expect(result.current).toBeNull();
  });

  test('throws FormTypeError for a string field value', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent('');

    await expect(renderHook(() => useNormalizeFieldValueNumber(), { wrapper })).rejects.toThrow(FormTypeError);
  });

  test('throws FormTypeError for a object field value', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent({});

    await expect(renderHook(() => useNormalizeFieldValueNumber(), { wrapper })).rejects.toThrow(FormTypeError);
  });
});
