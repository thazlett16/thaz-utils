import { renderHook } from 'vitest-browser-react';

import type { ReactNode } from 'react';

import { describe, expect, test } from 'vite-plus/test';

import { BaseForm } from '#src/components/tanstack-form.config';
import { FormTypeError } from '#src/error';
import { useNormalizeFieldValueNumber } from '#src/hooks/normalize-field-value-number';

class NormalizeNumberHookUtils {
  public createWrapperComponent(baseDefaultNameValue: unknown) {
    const { useAppForm } = BaseForm;

    return function WrapperComponent({ children }: { children: ReactNode }) {
      interface Person {
        name: unknown;
      }

      const form = useAppForm({
        defaultValues: {
          name: baseDefaultNameValue,
        } as Person,
      });

      return (
        <form.AppForm>
          <form.AppField
            name="name"
            children={() => {
              return <>{children}</>;
            }}
          />
        </form.AppForm>
      );
    };
  }
}

describe('useNormalizeFieldValueNumber', () => {
  test('returns a number ( 0 ) value unchanged', async () => {
    const normalizeNumberHookUtils = new NormalizeNumberHookUtils();

    const wrapper = normalizeNumberHookUtils.createWrapperComponent(0);

    const { result } = await renderHook(() => useNormalizeFieldValueNumber(), { wrapper });
    expect(result.current).toBe(0);
  });

  test('returns a number ( +1 ) value unchanged', async () => {
    const normalizeNumberHookUtils = new NormalizeNumberHookUtils();

    const wrapper = normalizeNumberHookUtils.createWrapperComponent(1);

    const { result } = await renderHook(() => useNormalizeFieldValueNumber(), { wrapper });
    expect(result.current).toBe(1);
  });

  test('returns a number ( -1 ) value unchanged', async () => {
    const normalizeNumberHookUtils = new NormalizeNumberHookUtils();

    const wrapper = normalizeNumberHookUtils.createWrapperComponent(-1);

    const { result } = await renderHook(() => useNormalizeFieldValueNumber(), { wrapper });
    expect(result.current).toBe(-1);
  });

  test('returns null for null', async () => {
    const normalizeNumberHookUtils = new NormalizeNumberHookUtils();

    const wrapper = normalizeNumberHookUtils.createWrapperComponent(null);

    const { result } = await renderHook(() => useNormalizeFieldValueNumber(), { wrapper });
    expect(result.current).toBeNull();
  });

  test('returns null for undefined', async () => {
    const normalizeNumberHookUtils = new NormalizeNumberHookUtils();

    const wrapper = normalizeNumberHookUtils.createWrapperComponent(undefined);

    const { result } = await renderHook(() => useNormalizeFieldValueNumber(), { wrapper });
    expect(result.current).toBeNull();
  });

  test('throws FormTypeError for a string field value', async () => {
    const normalizeNumberHookUtils = new NormalizeNumberHookUtils();

    const wrapper = normalizeNumberHookUtils.createWrapperComponent('');

    await expect(renderHook(() => useNormalizeFieldValueNumber(), { wrapper })).rejects.toThrow(FormTypeError);
  });

  test('throws FormTypeError for a object field value', async () => {
    const normalizeNumberHookUtils = new NormalizeNumberHookUtils();

    const wrapper = normalizeNumberHookUtils.createWrapperComponent({});

    await expect(renderHook(() => useNormalizeFieldValueNumber(), { wrapper })).rejects.toThrow(FormTypeError);
  });
});
