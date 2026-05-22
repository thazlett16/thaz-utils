import { renderHook } from 'vitest-browser-react';

import { describe, expect, test, vi } from 'vite-plus/test';

import { useCanSubmit } from '#src/hooks/can-submit';

import { CanSubmitTestUtils } from './can-submit-test-utils';

describe('useCanSubmit', () => {
  test('returns true when not submitting', async () => {
    const wrapper = CanSubmitTestUtils.createWrapperComponent({
      defaultTestValue: 'valid',
    });

    const { result } = await renderHook(() => useCanSubmit(), { wrapper });

    expect(result.current).toBeTruthy();
  });

  test('returns true when form is valid and allowSubmitWhenInvalid is true', async () => {
    const wrapper = CanSubmitTestUtils.createWrapperComponent({
      defaultTestValue: 'valid',
    });

    const { result } = await renderHook(() => useCanSubmit({ allowSubmitWhenInvalid: true }), { wrapper });

    expect(result.current).toBeTruthy();
  });

  test('returns false when form is invalid and allowSubmitWhenInvalid is true', async () => {
    const wrapper = CanSubmitTestUtils.createWrapperComponent({
      defaultTestValue: 'valid',
    });

    const { result, act } = await renderHook(() => useCanSubmit({ allowSubmitWhenInvalid: true }), { wrapper });

    expect(result.current).toBeTruthy();

    await act(async () => {
      await CanSubmitTestUtils.setInputValue('ab');
    });

    expect(result.current).toBeFalsy();
  });

  test('returns true when field recovers to valid after being invalid and allowSubmitWhenInvalid is true', async () => {
    const wrapper = CanSubmitTestUtils.createWrapperComponent({
      defaultTestValue: 'valid',
    });

    const { result, act } = await renderHook(() => useCanSubmit({ allowSubmitWhenInvalid: true }), { wrapper });

    expect(result.current).toBeTruthy();

    await act(async () => {
      await CanSubmitTestUtils.setInputValue('ab');
    });

    expect(result.current).toBeFalsy();

    await act(async () => {
      await CanSubmitTestUtils.setInputValue('valid');
    });

    expect(result.current).toBeTruthy();
  });

  test('returns false while submitting when allowSubmitWhenInvalid is true', async () => {
    vi.useFakeTimers();

    const wrapper = CanSubmitTestUtils.createWrapperComponent({
      defaultTestValue: 'valid',
      onSubmitAsync: async () => {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 1000);
        });
      },
    });

    const { result, act } = await renderHook(() => useCanSubmit({ allowSubmitWhenInvalid: true }), { wrapper });

    expect(result.current).toBeTruthy();

    await act(async () => {
      await CanSubmitTestUtils.submitForm();
    });

    expect(result.current).toBeFalsy();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(result.current).toBeTruthy();

    vi.useRealTimers();
  });
});
