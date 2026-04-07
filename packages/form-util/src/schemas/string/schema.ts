import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/schemas/types';

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
 *
 */
export function string(messages: FormWrongTypeMessage, ...actions: StringAction[]): ReturnType<typeof _stringNullable>;

/**
 *
 */
export function string(messages: FormRequiredMessage, ...actions: StringAction[]): ReturnType<typeof _stringRequired>;

export function string(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: StringAction[]) {
  if ('requiredMessage' in messages) {
    return _stringRequired(messages, ...actions);
  }

  return _stringNullable(messages, ...actions);
}

// const stringExample = v.object({
//     testRequired: string({
//         wrongTypeMessage: 'Not a String',
//         requiredMessage: 'Field is Required',
//     }),
//     testNullable: string({
//         wrongTypeMessage: 'Not a String',
//     }),
//     testRequiredWithActions: string({
//         wrongTypeMessage: 'Not a String',
//         requiredMessage: 'Field is Required',
//     }, v.ltValue(100), v.gtValue(5), v.check((val) => val === 20)),
//     testNullableWithActions: string({
//         wrongTypeMessage: 'Not a String',
//     }, v.ltValue(100), v.gtValue(5), v.check((val) => val === 20)),
// });
// type InputStringExample = v.InferInput<typeof stringExample>
// type OutputStringExample = v.InferOutput<typeof stringExample>
