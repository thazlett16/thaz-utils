import type { Temporal } from '@js-temporal/polyfill';

import * as t from '@thazstack/temporal-valibot-util';
import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/schemas/types';

export type PlainTimeAction = v.BaseValidation<Temporal.PlainTime, Temporal.PlainTime, v.BaseIssue<unknown>>;

export function _plainTimeNullable(messages: FormWrongTypeMessage, ...actions: PlainTimeAction[]) {
  return v.union(
    [
      v.null(),
      v.pipe(
        v.undefined(),
        v.transform(() => null),
      ),
      v.pipe(t.plainTime(), ...actions),
      v.pipe(
        t.zonedDateTime(),
        v.transform((val) => val.toPlainTime()),
        v.pipe(t.plainTime(), ...actions),
      ),
      v.pipe(
        t.plainDateTime(),
        v.transform((val) => val.toPlainTime()),
        v.pipe(t.plainTime(), ...actions),
      ),
      v.pipe(
        v.string(),
        v.trim(),
        v.union([
          v.pipe(
            v.literal(''),
            v.transform(() => null),
          ),
          v.pipe(v.string(), t.toPlainTime(messages.wrongTypeMessage), v.pipe(t.plainTime(), ...actions)),
        ]),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

export function _plainTimeRequired(messages: FormRequiredMessage, ...actions: PlainTimeAction[]) {
  return v.pipe(_plainTimeNullable(messages), v.pipe(t.plainTime(messages.requiredMessage), ...actions));
}

/**
 *
 */
export function plainTime(
  messages: FormWrongTypeMessage,
  ...actions: PlainTimeAction[]
): ReturnType<typeof _plainTimeNullable>;

/**
 *
 */
export function plainTime(
  messages: FormRequiredMessage,
  ...actions: PlainTimeAction[]
): ReturnType<typeof _plainTimeRequired>;

export function plainTime(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: PlainTimeAction[]) {
  if ('requiredMessage' in messages) {
    return _plainTimeRequired(messages, ...actions);
  }

  return _plainTimeNullable(messages, ...actions);
}

// const plainTimeExample = v.object({
//     testRequired: plainTime({
//         wrongTypeMessage: 'Not a PlainTime',
//         requiredMessage: 'Field is Required',
//     }),
//     testNullable: plainTime({
//         wrongTypeMessage: 'Not a PlainTime',
//     }),
//     testRequiredWithActions: plainTime({
//         wrongTypeMessage: 'Not a PlainTime',
//         requiredMessage: 'Field is Required',
//     }, v.check((val) => val === Temporal.Now.plainTimeISO())),
//     testNullableWithActions: plainTime({
//         wrongTypeMessage: 'Not a PlainTime',
//     }, v.check((val) => val === Temporal.Now.plainTimeISO())),
// });
// type InputPlainTimeExample = v.InferInput<typeof plainTimeExample>
// type OutputPlainTimeExample = v.InferOutput<typeof plainTimeExample>
