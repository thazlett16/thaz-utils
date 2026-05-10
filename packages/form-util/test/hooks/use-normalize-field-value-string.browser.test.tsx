import { renderHook } from 'vitest-browser-react';

import { describe, expect, test } from 'vite-plus/test';

import { FormTypeError } from '#src/error';
import { useNormalizeFieldValueString } from '#src/hooks/normalize-field-value-string';
import { NormalizeHookTestUtils } from '#test/normalize-hook-test-utils';

describe('useNormalizeFieldValueString', () => {
  test('returns a string value unchanged', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent('FirstName');

    const { result } = await renderHook(() => useNormalizeFieldValueString(), { wrapper });
    expect(result.current).toBe('FirstName');
  });

  test('returns an empty string unchanged', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent('');

    const { result } = await renderHook(() => useNormalizeFieldValueString(), { wrapper });
    expect(result.current).toBe('');
  });

  test('returns empty string for null', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent(null);

    const { result } = await renderHook(() => useNormalizeFieldValueString(), { wrapper });
    expect(result.current).toBe('');
  });

  test('returns empty string for undefined', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent(undefined);

    const { result } = await renderHook(() => useNormalizeFieldValueString(), { wrapper });
    expect(result.current).toBe('');
  });

  test('throws FormTypeError for a number field value', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent(0);

    await expect(renderHook(() => useNormalizeFieldValueString(), { wrapper })).rejects.toThrow(FormTypeError);
  });

  test('throws FormTypeError for a object field value', async () => {
    const normalizeHookTestUtils = new NormalizeHookTestUtils();

    const wrapper = normalizeHookTestUtils.createWrapperComponent({});

    await expect(renderHook(() => useNormalizeFieldValueString(), { wrapper })).rejects.toThrow(FormTypeError);
  });
});
