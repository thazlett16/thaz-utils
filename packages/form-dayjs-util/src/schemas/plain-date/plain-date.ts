import * as f from '@thazstack/form-util';
import * as t from '@thazstack/temporal-valibot-util';
import * as v from 'valibot';

import { isDayJSValid } from '#src/actions/is-dayjs-valid/is-dayjs-valid';
import { toPlainDate } from '#src/actions/to-plain-date-value/to-plain-date-value';
import { dayjs } from '#src/schemas/dayjs/dayjs';

export function _plainDateNullable(messages: f.FormWrongTypeMessage, ...actions: f.PlainDateAction[]) {
  return v.union(
    [
      f._plainDateNullable(messages, ...actions),
      v.pipe(
        dayjs(),
        isDayJSValid(messages.wrongTypeMessage),
        toPlainDate(messages.wrongTypeMessage),
        v.pipe(t.plainDate(), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

export function _plainDateRequired(messages: f.FormRequiredMessage, ...actions: f.PlainDateAction[]) {
  return v.pipe(_plainDateNullable(messages, ...actions), t.plainDate(messages.requiredMessage));
}

/**
 *
 */
export function plainDate(
  messages: f.FormWrongTypeMessage,
  ...actions: f.PlainDateAction[]
): ReturnType<typeof _plainDateNullable>;

/**
 *
 */
export function plainDate(
  messages: f.FormRequiredMessage,
  ...actions: f.PlainDateAction[]
): ReturnType<typeof _plainDateRequired>;

export function plainDate(messages: f.FormWrongTypeMessage | f.FormRequiredMessage, ...actions: f.PlainDateAction[]) {
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
