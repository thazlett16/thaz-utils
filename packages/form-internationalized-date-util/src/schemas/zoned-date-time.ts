import * as f from '@thazstack/form-util';
import * as t from '@thazstack/temporal-valibot-util';

import * as v from 'valibot';

import { toZonedDateTime } from '#src/actions/to-zoned-date-time-value';
import { internationalizedZonedDateTime } from '#src/schemas/intl-zoned-date-time';

export function _zonedDateTimeNullable(messages: f.FormWrongTypeMessage, ...actions: f.ZonedDateTimeAction[]) {
  return v.union(
    [
      f._zonedDateTimeNullable(messages, ...actions),
      v.pipe(
        internationalizedZonedDateTime(),
        toZonedDateTime(messages.wrongTypeMessage),
        v.pipe(t.zonedDateTime(), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

export function _zonedDateTimeRequired(messages: f.FormRequiredMessage, ...actions: f.ZonedDateTimeAction[]) {
  return v.pipe(_zonedDateTimeNullable(messages, ...actions), t.zonedDateTime(messages.requiredMessage));
}

/**
 *
 */
export function zonedDateTime(
  messages: f.FormWrongTypeMessage,
  ...actions: f.ZonedDateTimeAction[]
): ReturnType<typeof _zonedDateTimeNullable>;

/**
 *
 */
export function zonedDateTime(
  messages: f.FormRequiredMessage,
  ...actions: f.ZonedDateTimeAction[]
): ReturnType<typeof _zonedDateTimeRequired>;

export function zonedDateTime(
  messages: f.FormWrongTypeMessage | f.FormRequiredMessage,
  ...actions: f.ZonedDateTimeAction[]
) {
  if ('requiredMessage' in messages) {
    return _zonedDateTimeRequired(messages, ...actions);
  }

  return _zonedDateTimeNullable(messages, ...actions);
}

// const zonedDateTimeExample = v.object({
//     testRequired: zonedDateTime({
//         wrongTypeMessage: 'Not a ZonedDateTime',
//         requiredMessage: 'Field is Required',
//     }),
//     testNullable: zonedDateTime({
//         wrongTypeMessage: 'Not a ZonedDateTime',
//     }),
//     testRequiredWithActions: zonedDateTime({
//         wrongTypeMessage: 'Not a ZonedDateTime',
//         requiredMessage: 'Field is Required',
//     }, v.check((val) => val === Temporal.Now.zonedDateTimeISO())),
//     testNullableWithActions: zonedDateTime({
//         wrongTypeMessage: 'Not a ZonedDateTime',
//     }, v.check((val) => val === Temporal.Now.zonedDateTimeISO())),
// });
// type InputZonedDateTimeExample = v.InferInput<typeof zonedDateTimeExample>
// type OutputZonedDateTimeExample = v.InferOutput<typeof zonedDateTimeExample>
