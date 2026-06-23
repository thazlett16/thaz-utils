import type { ReactNode } from 'react';

import { page, userEvent } from 'vite-plus/test/browser';

import { useAppForm } from '#test/config/test-form-root';

export const FieldErrorMessageTestUtils = {
  createWrapperComponent(options: { defaultTestValue: string; messageShape?: 'STANDARD_SCHEMA' | 'INVALID_SHAPE' }) {
    return function WrapperComponent({ children }: { children: ReactNode }) {
      interface TestValue {
        testValue: string;
      }

      const form = useAppForm({
        defaultValues: {
          testValue: options.defaultTestValue,
        } as TestValue,
        validators: {
          onChange: ({ value }) => {
            if (options.messageShape === 'STANDARD_SCHEMA') {
              if (value.testValue.length < 3) {
                return {
                  fields: {
                    testValue: { message: 'STANDARD_SCHEMA - Error Message Min Length 3' },
                  },
                };
              }
            } else if (options.messageShape === 'INVALID_SHAPE') {
              if (value.testValue.length < 3) {
                return {
                  fields: {
                    testValue: { code: 'INVALID - Error Message Min Length 3' },
                  },
                };
              }
            } else {
              if (value.testValue.length < 3) {
                return {
                  fields: {
                    testValue: 'Error Message Min Length 3',
                  },
                };
              }
            }

            return null;
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
  submitButton() {
    return page.getByRole('button');
  },
  textInput() {
    return page.getByRole('textbox');
  },
  async blurInput() {
    await userEvent.tab();
  },
  async clearInputValue() {
    await userEvent.clear(FieldErrorMessageTestUtils.textInput());
  },
  async setInputValue(value: string) {
    await FieldErrorMessageTestUtils.clearInputValue();
    await userEvent.type(FieldErrorMessageTestUtils.textInput(), value);
  },
  async submitForm() {
    await userEvent.click(FieldErrorMessageTestUtils.submitButton());
  },
};
