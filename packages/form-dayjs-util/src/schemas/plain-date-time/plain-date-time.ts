import * as f from '@thazstack/form-util';
import * as t from '@thazstack/temporal-valibot-util';

import * as v from 'valibot';

import { isDayJSValid } from '#src/actions/is-dayjs-valid/is-dayjs-valid';
import { toPlainDateTime } from '#src/actions/to-plain-date-time-value/to-plain-date-time-value';
import { dayjs } from '#src/schemas/dayjs/dayjs';

export function _plainDateTimeNullable(messages: f.FormWrongTypeMessage, ...actions: f.PlainDateTimeAction[]) {
  return v.union(
    [
      f._plainDateTimeNullable(messages, ...actions),
      v.pipe(
        dayjs(),
        isDayJSValid(messages.wrongTypeMessage),
        toPlainDateTime(messages.wrongTypeMessage),
        v.pipe(t.plainDateTime(), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

export function _plainDateTimeRequired(messages: f.FormRequiredMessage, ...actions: f.PlainDateTimeAction[]) {
  return v.pipe(_plainDateTimeNullable(messages, ...actions), t.plainDateTime(messages.requiredMessage));
}

/**
 *
 */
export function plainDateTime(
  messages: f.FormWrongTypeMessage,
  ...actions: f.PlainDateTimeAction[]
): ReturnType<typeof _plainDateTimeNullable>;

/**
 *
 */
export function plainDateTime(
  messages: f.FormRequiredMessage,
  ...actions: f.PlainDateTimeAction[]
): ReturnType<typeof _plainDateTimeRequired>;

export function plainDateTime(
  messages: f.FormWrongTypeMessage | f.FormRequiredMessage,
  ...actions: f.PlainDateTimeAction[]
) {
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
