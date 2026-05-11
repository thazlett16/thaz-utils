import type { ReactNode } from 'react';

import { page, userEvent } from 'vite-plus/test/browser';

import { BaseForm } from '#src/components/tanstack-form.config';
import { useFieldContext } from '#src/tanstack-form.config';

export class FieldErrorMessageTestUtils {
  createWrapperComponent(defaultTestValue: string, messageShape?: 'STANDARD_SCHEMA' | 'INVALID_SHAPE') {
    function TestInput() {
      const field = useFieldContext<string>();

      return (
        <>
          <input
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => {
              field.handleChange(e.target.value);
            }}
          />
        </>
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
            if (messageShape === 'STANDARD_SCHEMA') {
              if (value.testValue.length < 3) {
                return {
                  fields: {
                    testValue: { message: 'STANDARD_SCHEMA - Error Message Min Length 3' },
                  },
                };
              }
            } else if (messageShape === 'INVALID_SHAPE') {
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
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();

            form.handleSubmit();
          }}
        >
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
        </form>
      );
    };
  }

  get submitButton() {
    return page.getByRole('button');
  }

  get textInput() {
    return page.getByRole('textbox');
  }

  async blurInput() {
    await userEvent.tab();
  }

  async clearInputValue() {
    await userEvent.clear(this.textInput);
  }

  async setInputValue(value: string) {
    await this.clearInputValue();
    await userEvent.type(this.textInput, value);
  }

  async submitForm() {
    await userEvent.click(this.submitButton);
  }
}
