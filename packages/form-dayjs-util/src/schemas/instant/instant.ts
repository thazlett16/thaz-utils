import * as f from '@thazstack/form-util';
import * as t from '@thazstack/temporal-valibot-util';
import * as v from 'valibot';

import { isDayJSValid } from '#src/actions/is-dayjs-valid/is-dayjs-valid';
import { toInstant } from '#src/actions/to-instant-value/to-instant-value';
import { dayjs } from '#src/schemas/dayjs/dayjs';

export function _instantNullable(messages: f.FormWrongTypeMessage, ...actions: f.InstantAction[]) {
  return v.union(
    [
      f._instantNullable(messages, ...actions),
      v.pipe(
        dayjs(),
        isDayJSValid(messages.wrongTypeMessage),
        toInstant(messages.wrongTypeMessage),
        v.pipe(t.instant(), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

export function _instantRequired(messages: f.FormRequiredMessage, ...actions: f.InstantAction[]) {
  return v.pipe(_instantNullable(messages, ...actions), t.instant(messages.requiredMessage));
}

/**
 *
 */
export function instant(
  messages: f.FormWrongTypeMessage,
  ...actions: f.InstantAction[]
): ReturnType<typeof _instantNullable>;

/**
 *
 */
export function instant(
  messages: f.FormRequiredMessage,
  ...actions: f.InstantAction[]
): ReturnType<typeof _instantRequired>;

export function instant(messages: f.FormWrongTypeMessage | f.FormRequiredMessage, ...actions: f.InstantAction[]) {
  if ('requiredMessage' in messages) {
    return _instantRequired(messages, ...actions);
  }

  return _instantNullable(messages, ...actions);
}

// const instantExample = v.object({
//     testRequired: instant({
//         wrongTypeMessage: 'Not a Instant',
//         requiredMessage: 'Field is Required',
//     }),
//     testNullable: instant({
//         wrongTypeMessage: 'Not a Instant',
//     }),
//     testRequiredWithActions: instant({
//         wrongTypeMessage: 'Not a Instant',
//         requiredMessage: 'Field is Required',
//     }, v.check((val) => val === Temporal.Now.instant())),
//     testNullableWithActions: instant({
//         wrongTypeMessage: 'Not a Instant',
//     }, v.check((val) => val === Temporal.Now.instant())),
// });
// type InputInstantExample = v.InferInput<typeof instantExample>
// type OutputInstantExample = v.InferOutput<typeof instantExample>
