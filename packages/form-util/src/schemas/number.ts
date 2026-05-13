import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/schemas/types';
import { isFormRequiredMessage } from '#src/schemas/types';

export type NumberAction = v.BaseValidation<number, number, v.BaseIssue<unknown>>;

/**
 * Builds the nullable variant of the number schema. Output type is `number` | `null`.
 *
 * Accepts/Transforms as follows: `null` / `undefined` / `number`
 *
 * @param messages - {@link FormWrongTypeMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `number` value.
 *
 * @returns A valibot union schema that outputs `number` | `null`.
 */
export function _numberNullable(messages: FormWrongTypeMessage, ...actions: NumberAction[]) {
  return v.union(
    [
      v.null(),
      v.pipe(
        v.undefined(),
        v.transform(() => null),
      ),
      v.pipe(v.number(messages.wrongTypeMessage), v.finite(messages.wrongTypeMessage), ...actions),
    ],
    messages.wrongTypeMessage,
  );
}

/**
 * Builds the required variant of the number schema. Asserts that the result is a non-null `number`.
 *
 * Accepts/Transforms as follows: `null` / `undefined` / `number`
 *
 * @param messages - {@link FormRequiredMessage} providing both wrong-type and required error text.
 * @param actions - Additional valibot actions applied to the `number` value.
 *
 * @returns A valibot pipe schema that outputs `number`.
 */
export function _numberRequired(messages: FormRequiredMessage, ...actions: NumberAction[]) {
  return v.pipe(_numberNullable(messages), v.pipe(v.number(messages.requiredMessage), ...actions));
}

/**
 * Number schema requires passing `wrongTypeMessage` and can be marked as a required variant schema by adding `requiredMessage`.
 * Output type is `number` | `null` or `number` for required variant.
 *
 * Accepts/Transforms as follows: `null` / `undefined` / `number`
 *
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `number` value.
 *
 * @returns A valibot schema that outputs `number` | `null` or `number`.
 */
export function number<T extends FormWrongTypeMessage | FormRequiredMessage>(
  messages: T,
  ...actions: NumberAction[]
): T extends FormRequiredMessage ? ReturnType<typeof _numberRequired> : ReturnType<typeof _numberNullable>;

/**
 * Number schema requires passing `wrongTypeMessage` and can be marked as a required variant schema by adding `requiredMessage`.
 * Output type is `number` | `null` or `number` for required variant.
 *
 * Accepts/Transforms as follows: `null` / `undefined` / `number`
 *
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `number` value.
 *
 * @returns A valibot schema that outputs `number` | `null` or `number`.
 */
export function number(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: NumberAction[]) {
  if (isFormRequiredMessage(messages)) {
    return _numberRequired(messages, ...actions);
  }

  return _numberNullable(messages, ...actions);
}
