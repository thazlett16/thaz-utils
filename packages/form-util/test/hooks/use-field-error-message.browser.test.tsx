import { renderHook } from 'vitest-browser-react';

import { describe, expect, test } from 'vite-plus/test';
// import { userEvent } from 'vite-plus/test/browser';

import { FieldErrorMessageUtils } from './field-error-message-utils';
import { useFieldErrorMessageList } from '#src/hooks/field-error-message';

describe('useFieldErrorMessageList', () => {
  test('returns null before blur or submission', async () => {
    const fieldErrorMessageUtils = new FieldErrorMessageUtils();

    const wrapper = fieldErrorMessageUtils.createWrapperComponent('');

    const { result } = await renderHook(() => useFieldErrorMessageList(), { wrapper });
    expect(result.current).toBeNull();
  });

  test('returns null after blur when field is valid', async () => {
    const fieldErrorMessageUtils = new FieldErrorMessageUtils();

    const wrapper = fieldErrorMessageUtils.createWrapperComponent('');

    const { result, act } = await renderHook(() => useFieldErrorMessageList(), { wrapper });

    expect(result.current).toBeNull();

    await act(async () => {
      await fieldErrorMessageUtils.setInputValue('valid');
    });

    await act(async () => {
      await fieldErrorMessageUtils.blurInput();
    });

    expect(result.current).toBeNull();
  });

  test('returns error message after blur when field is invalid', async () => {
    const fieldErrorMessageUtils = new FieldErrorMessageUtils();

    const wrapper = fieldErrorMessageUtils.createWrapperComponent('');

    const { result, act } = await renderHook(() => useFieldErrorMessageList(), { wrapper });

    expect(result.current).toBeNull();

    await act(async () => {
      await fieldErrorMessageUtils.setInputValue('ab');
    });

    await act(async () => {
      await fieldErrorMessageUtils.blurInput();
    });

    expect(result.current).toBe('Error Message Min Length 3');
  });

  test('returns error message after blur when field is invalid and then return null after field is valid', async () => {
    const fieldErrorMessageUtils = new FieldErrorMessageUtils();

    const wrapper = fieldErrorMessageUtils.createWrapperComponent('');

    const { result, act } = await renderHook(() => useFieldErrorMessageList(), { wrapper });

    expect(result.current).toBeNull();

    await act(async () => {
      await fieldErrorMessageUtils.setInputValue('ab');
    });

    await act(async () => {
      await fieldErrorMessageUtils.blurInput();
    });

    expect(result.current).toBe('Error Message Min Length 3');

    await act(async () => {
      await fieldErrorMessageUtils.setInputValue('abcde');
    });

    await act(async () => {
      await fieldErrorMessageUtils.blurInput();
    });

    expect(result.current).toBeNull();
  });

  test('returns error message after a submission attempt', async () => {
    const fieldErrorMessageUtils = new FieldErrorMessageUtils();

    const wrapper = fieldErrorMessageUtils.createWrapperComponent('ab');

    const { result, act } = await renderHook(() => useFieldErrorMessageList(), { wrapper });

    expect(result.current).toBeNull();

    await act(async () => {
      await fieldErrorMessageUtils.submitForm();
    });

    expect(result.current).toBe('Error Message Min Length 3');
  });
});
