import type { ReactNode } from 'react';

import { page, userEvent } from 'vite-plus/test/browser';

import { BaseForm } from '#src/components/tanstack-form.config';
import { useFieldContext } from '#src/tanstack-form.config';

export const CanSubmitTestUtils = {
  createWrapperComponent(options: { defaultTestValue: string; onSubmitAsync?: () => Promise<void> }) {
    const { defaultTestValue, onSubmitAsync } = options;

    function TestInput() {
      const field = useFieldContext<string>();

      return (
        <input
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => {
            field.handleChange(e.target.value);
          }}
        />
      );
    }

    const { useAppForm } = BaseForm.extendForm({
      fieldComponents: {
        TestInput,
      },
    });

    return function WrapperComponent({ children }: { children: ReactNode }) {
      interface TestValue {
        testValue: string;
      }

      const form = useAppForm({
        defaultValues: {
          testValue: defaultTestValue,
        } as TestValue,
        validators: {
          onChange: ({ value }) => {
            if (value.testValue.length < 3) {
              return {
                fields: {
                  testValue: 'Too short',
                },
              };
            }

            return null;
          },
          onSubmitAsync: async () => {
            if (onSubmitAsync) {
              await onSubmitAsync();
            }
          },
        },
      });

      return (
        <form.AppForm>
          <form.FormShell>
            <form.AppField
              name="testValue"
              children={(field) => (
                <div>
                  <field.TestInput />

                  {children}
                </div>
              )}
            />

            <button type="submit">Submit</button>
          </form.FormShell>
        </form.AppForm>
      );
    };
  },
  textInput() {
    return page.getByRole('textbox');
  },
  submitButton() {
    return page.getByRole('button');
  },
  async clearInputValue() {
    await userEvent.clear(CanSubmitTestUtils.textInput());
  },
  async setInputValue(value: string) {
    await CanSubmitTestUtils.clearInputValue();
    await userEvent.type(CanSubmitTestUtils.textInput(), value);
  },
  async submitForm() {
    await userEvent.click(CanSubmitTestUtils.submitButton());
  },
};
