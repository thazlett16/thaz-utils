import { renderHook } from 'vitest-browser-react';

import { describe, expect, test } from 'vite-plus/test';

import { FormTypeError } from '#src/error';
import { useNormalizeFieldValueString } from '#src/hooks/normalize-field-value-string';

import { NormalizeHookTestUtils } from './normalize-hook-test-utils';

describe('useNormalizeFieldValueString', () => {
  test('returns a string value unchanged', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({
      defaultTestValue: 'FirstName',
    });

    const { result } = await renderHook(() => useNormalizeFieldValueString(), { wrapper });
    expect(result.current).toBe('FirstName');
  });

  test('returns an empty string unchanged', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({
      defaultTestValue: '',
    });

    const { result } = await renderHook(() => useNormalizeFieldValueString(), { wrapper });
    expect(result.current).toBe('');
  });

  test('returns empty string for null', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({
      defaultTestValue: null,
    });

    const { result } = await renderHook(() => useNormalizeFieldValueString(), { wrapper });
    expect(result.current).toBe('');
  });

  test('returns empty string for undefined', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({
      defaultTestValue: undefined,
    });

    const { result } = await renderHook(() => useNormalizeFieldValueString(), { wrapper });
    expect(result.current).toBe('');
  });

  test('throws FormTypeError for a number field value', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({
      defaultTestValue: 0,
    });

    await expect(renderHook(() => useNormalizeFieldValueString(), { wrapper })).rejects.toThrow(FormTypeError);
  });

  test('throws FormTypeError for a object field value', async () => {
    const wrapper = NormalizeHookTestUtils.createWrapperComponent({
      defaultTestValue: {},
    });

    await expect(renderHook(() => useNormalizeFieldValueString(), { wrapper })).rejects.toThrow(FormTypeError);
  });
});
