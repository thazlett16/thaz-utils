import type { ReactNode } from 'react';

import { BaseForm } from '#src/components/tanstack-form.config';

export class NormalizeHookTestUtils {
  public createWrapperComponent(defaultTestValue: unknown) {
    const { useAppForm } = BaseForm;

    return function WrapperComponent({ children }: { children: ReactNode }) {
      interface TestValue {
        testValue: unknown;
      }

      const form = useAppForm({
        defaultValues: {
          testValue: defaultTestValue,
        } as TestValue,
      });

      return (
        <form.AppForm>
          <form.AppField
            name="testValue"
            children={() => {
              return <>{children}</>;
            }}
          />
        </form.AppForm>
      );
    };
  }
}
