import type { Temporal } from '@js-temporal/polyfill';

import * as t from '@thazstack/temporal-valibot-util';
import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/schemas/types';

export type PlainDateTimeAction = v.BaseValidation<
  Temporal.PlainDateTime,
  Temporal.PlainDateTime,
  v.BaseIssue<unknown>
>;

export function _plainDateTimeNullable(messages: FormWrongTypeMessage, ...actions: PlainDateTimeAction[]) {
  return v.union(
    [
      v.null(),
      v.pipe(
        v.undefined(),
        v.transform(() => null),
      ),
      v.pipe(t.plainDateTime(), ...actions),
      v.pipe(
        t.zonedDateTime(),
        v.transform((val) => val.toPlainDateTime()),
        v.pipe(t.plainDateTime(), ...actions),
      ),
      v.pipe(
        v.string(),
        v.trim(),
        v.union([
          v.pipe(
            v.literal(''),
            v.transform(() => null),
          ),
          v.pipe(v.string(), t.toPlainDateTime(messages.wrongTypeMessage), v.pipe(t.plainDateTime(), ...actions)),
        ]),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

export function _plainDateTimeRequired(messages: FormRequiredMessage, ...actions: PlainDateTimeAction[]) {
  return v.pipe(_plainDateTimeNullable(messages), v.pipe(t.plainDateTime(messages.requiredMessage), ...actions));
}

/**
 *
 */
export function plainDateTime(
  messages: FormWrongTypeMessage,
  ...actions: PlainDateTimeAction[]
): ReturnType<typeof _plainDateTimeNullable>;

/**
 *
 */
export function plainDateTime(
  messages: FormRequiredMessage,
  ...actions: PlainDateTimeAction[]
): ReturnType<typeof _plainDateTimeRequired>;

export function plainDateTime(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: PlainDateTimeAction[]) {
  if ('requiredMessage' in messages) {
    return _plainDateTimeRequired(messages, ...actions);
  }

  return _plainDateTimeNullable(messages, ...actions);
}

// const plainDateTimeExample = v.object({
//     testRequired: plainDateTime({
//         wrongTypeMessage: 'Not a PlainDateTime',
//         requiredMessage: 'Field is Required',
//     }),
//     testNullable: plainDateTime({
//         wrongTypeMessage: 'Not a PlainDateTime',
//     }),
//     testRequiredWithActions: plainDateTime({
//         wrongTypeMessage: 'Not a PlainDateTime',
//         requiredMessage: 'Field is Required',
//     }, v.check((val) => val === Temporal.Now.plainDateTimeISO())),
//     testNullableWithActions: plainDateTime({
//         wrongTypeMessage: 'Not a PlainDateTime',
//     }, v.check((val) => val === Temporal.Now.plainDateTimeISO())),
// });
// type InputPlainDateTimeExample = v.InferInput<typeof plainDateTimeExample>
// type OutputPlainDateTimeExample = v.InferOutput<typeof plainDateTimeExample>
