import * as f from '@thazstack/form-util';
import * as t from '@thazstack/temporal-valibot-util';
import * as v from 'valibot';

import { toPlainTime } from '#src/actions/to-plain-time-value';
import { internationalizedCalendarDateTime } from '#src/schemas/intl-calendar-date-time';
import { internationalizedTime } from '#src/schemas/intl-time';
import { internationalizedZonedDateTime } from '#src/schemas/intl-zoned-date-time';

export function _plainTimeNullable(messages: f.FormWrongTypeMessage, ...actions: f.PlainTimeAction[]) {
  return v.union(
    [
      f._plainTimeNullable(messages, ...actions),
      v.pipe(
        internationalizedZonedDateTime(),
        toPlainTime(messages.wrongTypeMessage),
        v.pipe(t.plainTime(), ...actions),
      ),
      v.pipe(
        internationalizedCalendarDateTime(),
        toPlainTime(messages.wrongTypeMessage),
        v.pipe(t.plainTime(), ...actions),
      ),
      v.pipe(internationalizedTime(), toPlainTime(messages.wrongTypeMessage), v.pipe(t.plainTime(), ...actions)),
    ],
    messages.wrongTypeMessage,
  );
}

export function _plainTimeRequired(messages: f.FormRequiredMessage, ...actions: f.PlainTimeAction[]) {
  return v.pipe(_plainTimeNullable(messages, ...actions), t.plainTime(messages.requiredMessage));
}

/**
 *
 */
export function plainTime(
  messages: f.FormWrongTypeMessage,
  ...actions: f.PlainTimeAction[]
): ReturnType<typeof _plainTimeNullable>;

/**
 *
 */
export function plainTime(
  messages: f.FormRequiredMessage,
  ...actions: f.PlainTimeAction[]
): ReturnType<typeof _plainTimeRequired>;

export function plainTime(messages: f.FormWrongTypeMessage | f.FormRequiredMessage, ...actions: f.PlainTimeAction[]) {
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
