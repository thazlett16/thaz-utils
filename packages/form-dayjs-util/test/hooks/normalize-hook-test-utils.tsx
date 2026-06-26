import type { ReactNode } from 'react';

import { BaseForm } from '#src/components';

export const NormalizeHookTestUtils = {
  createWrapperComponent(options: { defaultTestValue: unknown }) {
    const { useAppForm } = BaseForm;

    return function WrapperComponent({ children }: { children: ReactNode }) {
      interface TestValue {
        testValue: unknown;
      }

      const form = useAppForm({
        defaultValues: {
          testValue: options.defaultTestValue,
        } as TestValue,
      });

      return (
        <form.AppForm>
          <form.FormShell>
            <form.AppField
              name="testValue"
              children={() => {
                return <>{children}</>;
              }}
            />
          </form.FormShell>
        </form.AppForm>
      );
    };
  },
};
