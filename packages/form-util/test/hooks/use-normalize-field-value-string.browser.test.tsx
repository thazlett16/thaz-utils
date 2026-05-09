import { renderHook } from 'vitest-browser-react';

import type { ReactNode } from 'react';

import { describe, expect, test } from 'vite-plus/test';

import { BaseForm } from '#src/components/tanstack-form.config';
import { useNormalizeFieldValueString } from '#src/hooks/normalize-field-value-string';

class NormalizeStringComponentUtils {
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

describe('useNormalizeFieldValueString', () => {
  test('returns a string value unchanged', async () => {
    const normalizeStringComponentUtils = new NormalizeStringComponentUtils();

    const wrapper = normalizeStringComponentUtils.createWrapperComponent('FirstName');

    const { result } = await renderHook(() => useNormalizeFieldValueString(), { wrapper });
    expect(result.current).toBe('FirstName');
  });

  test('returns an empty string unchanged', async () => {
    const normalizeStringComponentUtils = new NormalizeStringComponentUtils();

    const wrapper = normalizeStringComponentUtils.createWrapperComponent('');

    const { result } = await renderHook(() => useNormalizeFieldValueString(), { wrapper });
    expect(result.current).toBe('');
  });

  test('returns empty string for null', async () => {
    const normalizeStringComponentUtils = new NormalizeStringComponentUtils();

    const wrapper = normalizeStringComponentUtils.createWrapperComponent(null);

    const { result } = await renderHook(() => useNormalizeFieldValueString(), { wrapper });
    expect(result.current).toBe('');
  });

  test('returns empty string for undefined', async () => {
    const normalizeStringComponentUtils = new NormalizeStringComponentUtils();

    const wrapper = normalizeStringComponentUtils.createWrapperComponent(undefined);

    const { result } = await renderHook(() => useNormalizeFieldValueString(), { wrapper });
    expect(result.current).toBe('');
  });

  test('throws FormTypeError for a number field value', async () => {
    const normalizeStringComponentUtils = new NormalizeStringComponentUtils();

    const wrapper = normalizeStringComponentUtils.createWrapperComponent(0);

    await expect(renderHook(() => useNormalizeFieldValueString(), { wrapper })).rejects.toThrow(
      'useNormalizeFieldValueString',
    );
  });

  test('throws FormTypeError for a object field value', async () => {
    const normalizeStringComponentUtils = new NormalizeStringComponentUtils();

    const wrapper = normalizeStringComponentUtils.createWrapperComponent({});

    await expect(renderHook(() => useNormalizeFieldValueString(), { wrapper })).rejects.toThrow(
      'useNormalizeFieldValueString',
    );
  });
});
