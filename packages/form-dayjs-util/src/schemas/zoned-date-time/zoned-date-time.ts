import type { TimeZoneOptions } from '@thazstack/temporal-util';

import * as f from '@thazstack/form-util';
import * as t from '@thazstack/temporal-valibot-util';
import * as v from 'valibot';

import { isDayJSValid } from '#src/actions/is-dayjs-valid/is-dayjs-valid';
import { toZonedDateTime } from '#src/actions/to-zoned-date-time-value/to-zoned-date-time-value';
import { dayjs } from '#src/schemas/dayjs/dayjs';

export type ZonedDateTimeOptions = Required<TimeZoneOptions>;

export function _zonedDateTimeNullable(
  options: ZonedDateTimeOptions,
  messages: f.FormWrongTypeMessage,
  ...actions: f.ZonedDateTimeAction[]
) {
  return v.union(
    [
      f._zonedDateTimeNullable(messages, ...actions),
      v.pipe(
        dayjs(),
        isDayJSValid(messages.wrongTypeMessage),
        toZonedDateTime(options, messages.wrongTypeMessage),
        v.pipe(t.zonedDateTime(), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

export function _zonedDateTimeRequired(
  options: ZonedDateTimeOptions,
  messages: f.FormRequiredMessage,
  ...actions: f.ZonedDateTimeAction[]
) {
  return v.pipe(_zonedDateTimeNullable(options, messages, ...actions), t.zonedDateTime(messages.requiredMessage));
}

/**
 *
 */
export function zonedDateTime(
  options: ZonedDateTimeOptions,
  messages: f.FormWrongTypeMessage,
  ...actions: f.ZonedDateTimeAction[]
): ReturnType<typeof _zonedDateTimeNullable>;

/**
 *
 */
export function zonedDateTime(
  options: ZonedDateTimeOptions,
  messages: f.FormRequiredMessage,
  ...actions: f.ZonedDateTimeAction[]
): ReturnType<typeof _zonedDateTimeRequired>;

export function zonedDateTime(
  options: ZonedDateTimeOptions,
  messages: f.FormWrongTypeMessage | f.FormRequiredMessage,
  ...actions: f.ZonedDateTimeAction[]
) {
  if ('requiredMessage' in messages) {
    return _zonedDateTimeRequired(options, messages, ...actions);
  }

  return _zonedDateTimeNullable(options, messages, ...actions);
}

// const zonedDateTimeExample = v.object({
//     testRequired: zonedDateTime({
//       timeZone: 'America/Denver'
//     }, {
//         wrongTypeMessage: 'Not a ZonedDateTime',
//         requiredMessage: 'Field is Required',
//     }),
//     testNullable: zonedDateTime({
//       timeZone: 'America/Denver'
//     }, {
//         wrongTypeMessage: 'Not a ZonedDateTime',
//     }),
//     testRequiredWithActions: zonedDateTime({
//       timeZone: 'America/Denver'
//     }, {
//         wrongTypeMessage: 'Not a ZonedDateTime',
//         requiredMessage: 'Field is Required',
//     }, v.check((val) => val === Temporal.Now.zonedDateTimeISO())),
//     testNullableWithActions: zonedDateTime({
//       timeZone: 'America/Denver'
//     }, {
//         wrongTypeMessage: 'Not a ZonedDateTime',
//     }, v.check((val) => val === Temporal.Now.zonedDateTimeISO())),
// });
// type InputZonedDateTimeExample = v.InferInput<typeof zonedDateTimeExample>
// type OutputZonedDateTimeExample = v.InferOutput<typeof zonedDateTimeExample>
