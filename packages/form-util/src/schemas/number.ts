import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/schemas/types';

export type NumberAction = v.BaseValidation<number, number, v.BaseIssue<unknown>>;

export function _numberNullable(messages: FormWrongTypeMessage, ...actions: NumberAction[]) {
  return v.union(
    [
      v.null(),
      v.pipe(
        v.undefined(),
        v.transform(() => null),
      ),
      v.pipe(v.number(), v.finite(messages.wrongTypeMessage), ...actions),
    ],
    messages.wrongTypeMessage,
  );
}

export function _numberRequired(messages: FormRequiredMessage, ...actions: NumberAction[]) {
  return v.pipe(_numberNullable(messages), v.pipe(v.number(messages.requiredMessage), ...actions));
}

/**
 * Nullable number schema. Coerces `undefined` to `null` and validates finite numbers.
 *
 * Accepts `null` (pass-through), `undefined` (→ `null`), and finite numbers.
 * Non-finite numbers (e.g. `Infinity`, `NaN`) and non-number types trigger `messages.wrongTypeMessage`.
 */
export function number(messages: FormWrongTypeMessage, ...actions: NumberAction[]): ReturnType<typeof _numberNullable>;

/**
 * Required number schema. Builds on the nullable variant and rejects `null` output.
 *
 * Accepts the same inputs as the nullable overload but rejects `null` results with
 * `messages.requiredMessage`.
 */
export function number(messages: FormRequiredMessage, ...actions: NumberAction[]): ReturnType<typeof _numberRequired>;

export function number(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: NumberAction[]) {
  if ('requiredMessage' in messages) {
    return _numberRequired(messages, ...actions);
  }

  return _numberNullable(messages, ...actions);
}

// const numberExample = v.object({
//     testRequired: number({
//         wrongTypeMessage: 'Not a Number',
//         requiredMessage: 'Field is Required',
//     }),
//     testNullable: number({
//         wrongTypeMessage: 'Not a Number',
//     }),
//     testRequiredWithActions: number({
//         wrongTypeMessage: 'Not a Number',
//         requiredMessage: 'Field is Required',
//     }, v.ltValue(100), v.gtValue(5), v.check((val) => val === 20)),
//     testNullableWithActions: number({
//         wrongTypeMessage: 'Not a Number',
//     }, v.ltValue(100), v.gtValue(5), v.check((val) => val === 20)),
// });
// type InputNumberExample = v.InferInput<typeof numberExample>
// type OutputNumberExample = v.InferOutput<typeof numberExample>
