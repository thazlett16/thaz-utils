import type { Temporal } from '@js-temporal/polyfill';

import * as t from '@thazstack/temporal-valibot-util';
import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/schemas/types';

export type PlainDateAction = v.BaseValidation<Temporal.PlainDate, Temporal.PlainDate, v.BaseIssue<unknown>>;

export function _plainDateNullable(messages: FormWrongTypeMessage, ...actions: PlainDateAction[]) {
  return v.union(
    [
      v.null(),
      v.pipe(t.plainDate(), ...actions),
      v.pipe(
        t.zonedDateTime(),
        v.transform((val) => val.toPlainDate()),
        v.pipe(t.plainDate(), ...actions),
      ),
      v.pipe(
        t.plainDateTime(),
        v.transform((val) => val.toPlainDate()),
        v.pipe(t.plainDate(), ...actions),
      ),
      v.pipe(
        v.string(),
        v.trim(),
        v.union([
          v.pipe(
            v.literal(''),
            v.transform(() => null),
          ),
          v.pipe(v.string(), t.toPlainDate(messages.wrongTypeMessage), v.pipe(t.plainDate(), ...actions)),
        ]),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

export function _plainDateRequired(messages: FormRequiredMessage, ...actions: PlainDateAction[]) {
  return v.pipe(_plainDateNullable(messages), v.pipe(t.plainDate(messages.requiredMessage), ...actions));
}

/**
 *
 */
export function plainDate(
  messages: FormWrongTypeMessage,
  ...actions: PlainDateAction[]
): ReturnType<typeof _plainDateNullable>;

/**
 *
 */
export function plainDate(
  messages: FormRequiredMessage,
  ...actions: PlainDateAction[]
): ReturnType<typeof _plainDateRequired>;

export function plainDate(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: PlainDateAction[]) {
  if ('requiredMessage' in messages) {
    return _plainDateRequired(messages, ...actions);
  }

  return _plainDateNullable(messages, ...actions);
}

// const plainDateExample = v.object({
//     testRequired: plainDate({
//         wrongTypeMessage: 'Not a PlainDate',
//         requiredMessage: 'Field is Required',
//     }),
//     testNullable: plainDate({
//         wrongTypeMessage: 'Not a PlainDate',
//     }),
//     testRequiredWithActions: plainDate({
//         wrongTypeMessage: 'Not a PlainDate',
//         requiredMessage: 'Field is Required',
//     }, v.check((val) => val === Temporal.Now.plainDateISO())),
//     testNullableWithActions: plainDate({
//         wrongTypeMessage: 'Not a PlainDate',
//     }, v.check((val) => val === Temporal.Now.plainDateISO())),
// });
// type InputPlainDateExample = v.InferInput<typeof plainDateExample>
// type OutputPlainDateExample = v.InferOutput<typeof plainDateExample>
