import { renderHook } from 'vitest-browser-react';

import { describe, expect, test } from 'vite-plus/test';

import { FormMessageShapeError } from '#src/form-error';
import { useFieldErrorMessageList } from '#src/hooks/field-error-message';

import { FieldErrorMessageTestUtils } from './field-error-message-test-utils';

describe('useFieldErrorMessageList', () => {
  test('returns null before blur or submission', async () => {
    const wrapper = FieldErrorMessageTestUtils.createWrapperComponent({
      defaultTestValue: '',
    });

    const { result } = await renderHook(() => useFieldErrorMessageList(), { wrapper });
    expect(result.current).toBeNull();
  });

  test('returns null after blur when field is valid', async () => {
    const wrapper = FieldErrorMessageTestUtils.createWrapperComponent({
      defaultTestValue: '',
    });

    const { result, act } = await renderHook(() => useFieldErrorMessageList(), { wrapper });

    expect(result.current).toBeNull();

    await act(async () => {
      await FieldErrorMessageTestUtils.setInputValue('valid');
    });

    await act(async () => {
      await FieldErrorMessageTestUtils.blurInput();
    });

    expect(result.current).toBeNull();
  });

  test('returns error message after blur when field is invalid', async () => {
    const wrapper = FieldErrorMessageTestUtils.createWrapperComponent({
      defaultTestValue: '',
    });

    const { result, act } = await renderHook(() => useFieldErrorMessageList(), { wrapper });

    expect(result.current).toBeNull();

    await act(async () => {
      await FieldErrorMessageTestUtils.setInputValue('ab');
    });

    await act(async () => {
      await FieldErrorMessageTestUtils.blurInput();
    });

    expect(result.current).toBe('Error Message Min Length 3');
  });

  test('returns error message after blur when field is invalid and then return null after field is valid', async () => {
    const wrapper = FieldErrorMessageTestUtils.createWrapperComponent({
      defaultTestValue: '',
    });

    const { result, act } = await renderHook(() => useFieldErrorMessageList(), { wrapper });

    expect(result.current).toBeNull();

    await act(async () => {
      await FieldErrorMessageTestUtils.setInputValue('ab');
    });

    await act(async () => {
      await FieldErrorMessageTestUtils.blurInput();
    });

    expect(result.current).toBe('Error Message Min Length 3');

    await act(async () => {
      await FieldErrorMessageTestUtils.setInputValue('abcde');
    });

    await act(async () => {
      await FieldErrorMessageTestUtils.blurInput();
    });

    expect(result.current).toBeNull();
  });

  test('returns error message after a submission attempt', async () => {
    const wrapper = FieldErrorMessageTestUtils.createWrapperComponent({
      defaultTestValue: 'ab',
    });

    const { result, act } = await renderHook(() => useFieldErrorMessageList(), { wrapper });

    expect(result.current).toBeNull();

    await act(async () => {
      await FieldErrorMessageTestUtils.submitForm();
    });

    expect(result.current).toBe('Error Message Min Length 3');
  });

  test('returns error message when error is in StandardSchema format', async () => {
    const wrapper = FieldErrorMessageTestUtils.createWrapperComponent({
      defaultTestValue: '',
      messageShape: 'STANDARD_SCHEMA',
    });

    const { result, act } = await renderHook(() => useFieldErrorMessageList(), { wrapper });

    expect(result.current).toBeNull();

    await act(async () => {
      await FieldErrorMessageTestUtils.setInputValue('ab');
    });

    await act(async () => {
      await FieldErrorMessageTestUtils.blurInput();
    });

    expect(result.current).toBe('STANDARD_SCHEMA - Error Message Min Length 3');
  });

  test('throws FormMessageShapeError when error message has unknown shape', async () => {
    const wrapper = FieldErrorMessageTestUtils.createWrapperComponent({
      defaultTestValue: '',
      messageShape: 'INVALID_SHAPE',
    });

    const { result, act } = await renderHook(() => useFieldErrorMessageList(), { wrapper });

    expect(result.current).toBeNull();

    await expect(
      act(async () => {
        await FieldErrorMessageTestUtils.setInputValue('ab');
      }),
    ).rejects.toThrow(FormMessageShapeError);
  });
});
