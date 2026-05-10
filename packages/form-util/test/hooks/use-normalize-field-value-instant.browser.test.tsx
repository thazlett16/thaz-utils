import { renderHook } from 'vitest-browser-react';

import type { ReactNode } from 'react';

import { Temporal } from '@js-temporal/polyfill';
import { assert, describe, expect, test } from 'vite-plus/test';

import { BaseForm } from '#src/components/tanstack-form.config';
import { FormTypeError } from '#src/error';
import { useNormalizeFieldValueInstant } from '#src/hooks/normalize-field-value-instant';

class NormalizeInstantHookUtils {
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

  get testZonedDateTime() {
    return Temporal.ZonedDateTime.from('2024-06-15T12:00:00-04:00[America/New_York]');
  }

  get testInstant() {
    return Temporal.Instant.from('2024-06-15T16:00:00Z');
  }

  get testPlainDateTime() {
    return Temporal.PlainDateTime.from('2024-06-15T12:00:00');
  }

  get testPlainDate() {
    return Temporal.PlainDate.from('2024-06-15');
  }
}

describe('useNormalizeFieldValueInstant', () => {
  test('returns an instant value unchanged', async () => {
    const normalizeInstantHookUtils = new NormalizeInstantHookUtils();

    const wrapper = normalizeInstantHookUtils.createWrapperComponent(normalizeInstantHookUtils.testInstant);

    const { result } = await renderHook(() => useNormalizeFieldValueInstant(), { wrapper });

    assert(result.current !== null);
    expect(normalizeInstantHookUtils.testInstant.equals(result.current)).toBeTruthy();
  });

  test('returns an instant value for ZonedDateTime', async () => {
    const normalizeInstantHookUtils = new NormalizeInstantHookUtils();

    const wrapper = normalizeInstantHookUtils.createWrapperComponent(normalizeInstantHookUtils.testZonedDateTime);

    const { result } = await renderHook(() => useNormalizeFieldValueInstant(), { wrapper });

    assert(result.current !== null);
    expect(normalizeInstantHookUtils.testInstant.equals(result.current)).toBeTruthy();
  });

  test('returns null for null', async () => {
    const normalizeInstantHookUtils = new NormalizeInstantHookUtils();

    const wrapper = normalizeInstantHookUtils.createWrapperComponent(null);

    const { result } = await renderHook(() => useNormalizeFieldValueInstant(), { wrapper });
    expect(result.current).toBeNull();
  });

  test('returns null for undefined', async () => {
    const normalizeInstantHookUtils = new NormalizeInstantHookUtils();

    const wrapper = normalizeInstantHookUtils.createWrapperComponent(undefined);

    const { result } = await renderHook(() => useNormalizeFieldValueInstant(), { wrapper });
    expect(result.current).toBeNull();
  });

  test('throws FormTypeError for a string field value', async () => {
    const normalizeInstantHookUtils = new NormalizeInstantHookUtils();

    const wrapper = normalizeInstantHookUtils.createWrapperComponent('');

    await expect(renderHook(() => useNormalizeFieldValueInstant(), { wrapper })).rejects.toThrow(FormTypeError);
  });

  test('throws FormTypeError for a number field value', async () => {
    const normalizeInstantHookUtils = new NormalizeInstantHookUtils();

    const wrapper = normalizeInstantHookUtils.createWrapperComponent(5);

    await expect(renderHook(() => useNormalizeFieldValueInstant(), { wrapper })).rejects.toThrow(FormTypeError);
  });

  test('throws FormTypeError for a PlainDateTime field value', async () => {
    const normalizeInstantHookUtils = new NormalizeInstantHookUtils();

    const wrapper = normalizeInstantHookUtils.createWrapperComponent(normalizeInstantHookUtils.testPlainDateTime);

    await expect(renderHook(() => useNormalizeFieldValueInstant(), { wrapper })).rejects.toThrow(FormTypeError);
  });

  test('throws FormTypeError for a PlainDate field value', async () => {
    const normalizeInstantHookUtils = new NormalizeInstantHookUtils();

    const wrapper = normalizeInstantHookUtils.createWrapperComponent(normalizeInstantHookUtils.testPlainDate);

    await expect(renderHook(() => useNormalizeFieldValueInstant(), { wrapper })).rejects.toThrow(FormTypeError);
  });

  test('throws FormTypeError for a object field value', async () => {
    const normalizeInstantHookUtils = new NormalizeInstantHookUtils();

    const wrapper = normalizeInstantHookUtils.createWrapperComponent({});

    await expect(renderHook(() => useNormalizeFieldValueInstant(), { wrapper })).rejects.toThrow(FormTypeError);
  });
});
