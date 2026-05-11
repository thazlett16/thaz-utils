import { renderHook } from 'vitest-browser-react';

import { describe, expect, test } from 'vite-plus/test';

import { FormMessageShapeError } from '#src/error';
import { useFieldErrorMessageList } from '#src/hooks/field-error-message';

import { FieldErrorMessageTestUtils } from './field-error-message-test-utils';

describe('useFieldErrorMessageList', () => {
  test('returns null before blur or submission', async () => {
    const fieldErrorMessageTestUtils = new FieldErrorMessageTestUtils();

    const wrapper = fieldErrorMessageTestUtils.createWrapperComponent('');

    const { result } = await renderHook(() => useFieldErrorMessageList(), { wrapper });
    expect(result.current).toBeNull();
  });

  test('returns null after blur when field is valid', async () => {
    const fieldErrorMessageTestUtils = new FieldErrorMessageTestUtils();

    const wrapper = fieldErrorMessageTestUtils.createWrapperComponent('');

    const { result, act } = await renderHook(() => useFieldErrorMessageList(), { wrapper });

    expect(result.current).toBeNull();

    await act(async () => {
      await fieldErrorMessageTestUtils.setInputValue('valid');
    });

    await act(async () => {
      await fieldErrorMessageTestUtils.blurInput();
    });

    expect(result.current).toBeNull();
  });

  test('returns error message after blur when field is invalid', async () => {
    const fieldErrorMessageTestUtils = new FieldErrorMessageTestUtils();

    const wrapper = fieldErrorMessageTestUtils.createWrapperComponent('');

    const { result, act } = await renderHook(() => useFieldErrorMessageList(), { wrapper });

    expect(result.current).toBeNull();

    await act(async () => {
      await fieldErrorMessageTestUtils.setInputValue('ab');
    });

    await act(async () => {
      await fieldErrorMessageTestUtils.blurInput();
    });

    expect(result.current).toBe('Error Message Min Length 3');
  });

  test('returns error message after blur when field is invalid and then return null after field is valid', async () => {
    const fieldErrorMessageTestUtils = new FieldErrorMessageTestUtils();

    const wrapper = fieldErrorMessageTestUtils.createWrapperComponent('');

    const { result, act } = await renderHook(() => useFieldErrorMessageList(), { wrapper });

    expect(result.current).toBeNull();

    await act(async () => {
      await fieldErrorMessageTestUtils.setInputValue('ab');
    });

    await act(async () => {
      await fieldErrorMessageTestUtils.blurInput();
    });

    expect(result.current).toBe('Error Message Min Length 3');

    await act(async () => {
      await fieldErrorMessageTestUtils.setInputValue('abcde');
    });

    await act(async () => {
      await fieldErrorMessageTestUtils.blurInput();
    });

    expect(result.current).toBeNull();
  });

  test('returns error message after a submission attempt', async () => {
    const fieldErrorMessageTestUtils = new FieldErrorMessageTestUtils();

    const wrapper = fieldErrorMessageTestUtils.createWrapperComponent('ab');

    const { result, act } = await renderHook(() => useFieldErrorMessageList(), { wrapper });

    expect(result.current).toBeNull();

    await act(async () => {
      await fieldErrorMessageTestUtils.submitForm();
    });

    expect(result.current).toBe('Error Message Min Length 3');
  });

  test('returns error message when error is in StandardSchema format', async () => {
    const fieldErrorMessageTestUtils = new FieldErrorMessageTestUtils();

    const wrapper = fieldErrorMessageTestUtils.createWrapperComponent('', 'STANDARD_SCHEMA');

    const { result, act } = await renderHook(() => useFieldErrorMessageList(), { wrapper });

    expect(result.current).toBeNull();

    await act(async () => {
      await fieldErrorMessageTestUtils.setInputValue('ab');
    });

    await act(async () => {
      await fieldErrorMessageTestUtils.blurInput();
    });

    expect(result.current).toBe('STANDARD_SCHEMA - Error Message Min Length 3');
  });

  test('throws FormMessageShapeError when error message has unknown shape', async () => {
    const fieldErrorMessageTestUtils = new FieldErrorMessageTestUtils();

    const wrapper = fieldErrorMessageTestUtils.createWrapperComponent('', 'INVALID_SHAPE');

    const { result, act } = await renderHook(() => useFieldErrorMessageList(), { wrapper });

    expect(result.current).toBeNull();

    await expect(
      act(async () => {
        await fieldErrorMessageTestUtils.setInputValue('ab');
      }),
    ).rejects.toThrow(FormMessageShapeError);
  });
});
