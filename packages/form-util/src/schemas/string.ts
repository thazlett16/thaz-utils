import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/schemas/types';
import { isFormRequiredMessage } from '#src/schemas/types';

export type StringAction = v.BaseValidation<string, string, v.BaseIssue<unknown>>;

/**
 * Builds the nullable variant of the string schema. Output type is `string` | `null`.
 *
 * Accepts/Transforms as follows: `null` / `undefined` / `string` (trimmed)
 *
 * @param messages - {@link FormWrongTypeMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `string` value.
 *
 * @returns A valibot union schema that outputs `string` | `null`.
 */
export function _stringNullable(messages: FormWrongTypeMessage, ...actions: StringAction[]) {
  return v.union(
    [
      v.null(),
      v.pipe(
        v.undefined(),
        v.transform(() => null),
      ),
      v.pipe(
        v.string(messages.wrongTypeMessage),
        v.trim(),
        v.union([
          v.pipe(
            v.literal(''),
            v.transform(() => null),
          ),
          v.pipe(v.string(messages.wrongTypeMessage), ...actions),
        ]),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

/**
 * Builds the required variant of the string schema. Asserts that the result is a non-null, non-empty `string`.
 *
 * Accepts/Transforms as follows: `null` / `undefined` / `string` (trimmed)
 *
 * @param messages - {@link FormRequiredMessage} providing both wrong-type and required error text.
 * @param actions - Additional valibot actions applied to the `string` value.
 *
 * @returns A valibot pipe schema that outputs `string`.
 */
export function _stringRequired(messages: FormRequiredMessage, ...actions: StringAction[]) {
  return v.pipe(_stringNullable(messages), v.pipe(v.string(messages.requiredMessage), ...actions));
}

/**
 * String schema requires passing `wrongTypeMessage` and can be marked as a required variant schema by adding `requiredMessage`.
 * Output type is `string` | `null` or `string` for required variant.
 *
 * Accepts/Transforms as follows: `null` / `undefined` / `string` (trimmed)
 *
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `string` value.
 *
 * @returns A valibot schema that outputs `string` | `null` or `string`.
 */
export function string<T extends FormWrongTypeMessage | FormRequiredMessage>(
  messages: T,
  ...actions: StringAction[]
): T extends FormRequiredMessage ? ReturnType<typeof _stringRequired> : ReturnType<typeof _stringNullable>;

/**
 * String schema requires passing `wrongTypeMessage` and can be marked as a required variant schema by adding `requiredMessage`.
 * Output type is `string` | `null` or `string` for required variant.
 *
 * Accepts/Transforms as follows: `null` / `undefined` / `string` (trimmed)
 *
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `string` value.
 *
 * @returns A valibot schema that outputs `string` | `null` or `string`.
 */
export function string(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: StringAction[]) {
  if (isFormRequiredMessage(messages)) {
    return _stringRequired(messages, ...actions);
  }

  return _stringNullable(messages, ...actions);
}
