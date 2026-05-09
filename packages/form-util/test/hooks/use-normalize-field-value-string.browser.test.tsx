import { renderHook } from 'vitest-browser-react';

import type { ReactNode } from 'react';

import { describe, expect, test } from 'vite-plus/test';

import { BaseForm } from '#src/components/tanstack-form.config';
import { useNormalizeFieldValueString } from '#src/hooks/normalize-field-value-string';

describe('useNormalizeFieldValueString', () => {
  test('returns a string value unchanged', async () => {
    const { useAppForm } = BaseForm;

    function WrapperComp({ children }: { children: ReactNode }) {
      interface Person {
        name: string | null | undefined;
      }

      const form = useAppForm({
        defaultValues: {
          name: 'FirstName',
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
    }

    const { result } = await renderHook(() => useNormalizeFieldValueString(), { wrapper: WrapperComp });
    expect(result.current).toBe('FirstName');
  });

  test('returns an empty string unchanged', async () => {
    const { useAppForm } = BaseForm;

    function WrapperComp({ children }: { children: ReactNode }) {
      interface Person {
        name: string | null | undefined;
      }

      const form = useAppForm({
        defaultValues: {
          name: '',
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
    }

    const { result } = await renderHook(() => useNormalizeFieldValueString(), { wrapper: WrapperComp });
    expect(result.current).toBe('');
  });

  test('returns empty string for null', async () => {
    const { useAppForm } = BaseForm;

    function WrapperComp({ children }: { children: ReactNode }) {
      interface Person {
        name: string | null | undefined;
      }

      const form = useAppForm({
        defaultValues: {
          name: null,
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
    }

    const { result } = await renderHook(() => useNormalizeFieldValueString(), { wrapper: WrapperComp });
    expect(result.current).toBe('');
  });

  test('returns empty string for undefined', async () => {
    const { useAppForm } = BaseForm;

    function WrapperComp({ children }: { children: ReactNode }) {
      interface Person {
        name: string | null | undefined;
      }

      const form = useAppForm({
        defaultValues: {
          name: undefined,
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
    }

    const { result } = await renderHook(() => useNormalizeFieldValueString(), { wrapper: WrapperComp });
    expect(result.current).toBe('');
  });

  test('throws FormTypeError for a number field value', async () => {
    const { useAppForm } = BaseForm;

    function WrapperComp({ children }: { children: ReactNode }) {
      interface Person {
        name: number;
      }

      const form = useAppForm({
        defaultValues: {
          name: 0,
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
    }

    await expect(renderHook(() => useNormalizeFieldValueString(), { wrapper: WrapperComp })).rejects.toThrow(
      'useNormalizeFieldValueString',
    );
  });

  test('throws FormTypeError for a object field value', async () => {
    const { useAppForm } = BaseForm;

    function WrapperComp({ children }: { children: ReactNode }) {
      interface Person {
        name: {};
      }

      const form = useAppForm({
        defaultValues: {
          name: {},
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
    }

    await expect(renderHook(() => useNormalizeFieldValueString(), { wrapper: WrapperComp })).rejects.toThrow(
      'useNormalizeFieldValueString',
    );
  });
});
