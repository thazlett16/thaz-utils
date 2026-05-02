import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/schemas/types';

import { isFormRequiredMessage } from '#src/schemas/types';

export type StringAction = v.BaseValidation<string, string, v.BaseIssue<unknown>>;

export function _stringNullable(messages: FormWrongTypeMessage, ...actions: StringAction[]) {
  return v.union(
    [
      v.null(),
      v.pipe(
        v.undefined(),
        v.transform(() => null),
      ),
      v.pipe(
        v.string(),
        v.trim(),
        v.union([
          v.pipe(
            v.literal(''),
            v.transform(() => null),
          ),
          v.pipe(v.string(), ...actions),
        ]),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

export function _stringRequired(messages: FormRequiredMessage, ...actions: StringAction[]) {
  return v.pipe(_stringNullable(messages), v.pipe(v.string(messages.requiredMessage), ...actions));
}

/**
 * String schema requires passing `wrongTypeMessage` and can be marked as a required variant schema by adding `requiredMessage`
 *
 * Accepts:
 *
 * `null`
 *
 * `undefined` -> `null`
 *
 * `string` is trimmed and if empty -> null
 */
export function string<T extends FormWrongTypeMessage | FormRequiredMessage>(
  messages: T,
  ...actions: StringAction[]
): T extends FormRequiredMessage ? ReturnType<typeof _stringRequired> : ReturnType<typeof _stringNullable>;

export function string(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: StringAction[]) {
  if (isFormRequiredMessage(messages)) {
    return _stringRequired(messages, ...actions);
  }

  return _stringNullable(messages, ...actions);
}
