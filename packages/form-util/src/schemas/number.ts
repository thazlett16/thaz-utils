import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/schemas/types';

import { isFormRequiredMessage } from '#src/schemas/types';

export type NumberAction = v.BaseValidation<number, number, v.BaseIssue<unknown>>;

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

export function _numberRequired(messages: FormRequiredMessage, ...actions: NumberAction[]) {
  return v.pipe(_numberNullable(messages), v.pipe(v.number(messages.requiredMessage), ...actions));
}

/**
 * Number schema requires passing `wrongTypeMessage` and can be marked as a required variant schema by adding `requiredMessage`
 *
 * Accepts:
 *
 * `null`
 *
 * `undefined` -> `null`
 *
 * `number` must be finite (rejects `Infinity`, `NaN`)
 */
export function number<T extends FormWrongTypeMessage | FormRequiredMessage>(
  messages: T,
  ...actions: NumberAction[]
): T extends FormRequiredMessage ? ReturnType<typeof _numberRequired> : ReturnType<typeof _numberNullable>;

export function number(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: NumberAction[]) {
  if (isFormRequiredMessage(messages)) {
    return _numberRequired(messages, ...actions);
  }

  return _numberNullable(messages, ...actions);
}
