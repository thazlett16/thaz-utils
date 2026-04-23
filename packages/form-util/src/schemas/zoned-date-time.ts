import * as t from '@thazstack/temporal-valibot-util';

import type { Temporal } from '@js-temporal/polyfill';

import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/schemas/types';

export type ZonedDateTimeAction = v.BaseValidation<
  Temporal.ZonedDateTime,
  Temporal.ZonedDateTime,
  v.BaseIssue<unknown>
>;

export function _zonedDateTimeNullable(messages: FormWrongTypeMessage, ...actions: ZonedDateTimeAction[]) {
  return v.union(
    [
      v.null(),
      v.pipe(
        v.undefined(),
        v.transform(() => null),
      ),
      v.pipe(t.zonedDateTime(), ...actions),
    ],
    messages.wrongTypeMessage,
  );
}

export function _zonedDateTimeRequired(messages: FormRequiredMessage, ...actions: ZonedDateTimeAction[]) {
  return v.pipe(_zonedDateTimeNullable(messages), v.pipe(t.zonedDateTime(messages.requiredMessage), ...actions));
}

/**
 *
 */
export function zonedDateTime(
  messages: FormWrongTypeMessage,
  ...actions: ZonedDateTimeAction[]
): ReturnType<typeof _zonedDateTimeNullable>;

/**
 *
 */
export function zonedDateTime(
  messages: FormRequiredMessage,
  ...actions: ZonedDateTimeAction[]
): ReturnType<typeof _zonedDateTimeRequired>;

export function zonedDateTime(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: ZonedDateTimeAction[]) {
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
//     }, v.check((val) => val === Temporal.Now.zonedDateTime())),
//     testNullableWithActions: zonedDateTime({
//         wrongTypeMessage: 'Not a ZonedDateTime',
//     }, v.check((val) => val === Temporal.Now.zonedDateTime())),
// });
// type InputZonedDateTimeExample = v.InferInput<typeof zonedDateTimeExample>
// type OutputZonedDateTimeExample = v.InferOutput<typeof zonedDateTimeExample>
