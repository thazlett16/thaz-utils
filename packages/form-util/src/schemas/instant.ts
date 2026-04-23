import * as t from '@thazstack/temporal-valibot-util';

import type { Temporal } from '@js-temporal/polyfill';

import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/schemas/types';

export type InstantAction = v.BaseValidation<Temporal.Instant, Temporal.Instant, v.BaseIssue<unknown>>;

export function _instantNullable(messages: FormWrongTypeMessage, ...actions: InstantAction[]) {
  return v.union(
    [
      v.null(),
      v.pipe(
        v.undefined(),
        v.transform(() => null),
      ),
      v.pipe(t.instant(), ...actions),
      v.pipe(
        t.zonedDateTime(),
        v.transform((val) => val.toInstant()),
        v.pipe(t.instant(), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

export function _instantRequired(messages: FormRequiredMessage, ...actions: InstantAction[]) {
  return v.pipe(_instantNullable(messages), v.pipe(t.instant(messages.requiredMessage), ...actions));
}

/**
 * Nullable `Temporal.Instant` schema.
 *
 * Accepts `null` (pass-through), `undefined` (→ `null`), `Temporal.Instant` (pass-through),
 * and `Temporal.ZonedDateTime` (→ `Temporal.Instant` via `.toInstant()`).
 * Any other type triggers `messages.wrongTypeMessage`.
 */
export function instant(
  messages: FormWrongTypeMessage,
  ...actions: InstantAction[]
): ReturnType<typeof _instantNullable>;

/**
 * Required `Temporal.Instant` schema. Builds on the nullable variant and rejects `null` output.
 *
 * Accepts the same inputs as the nullable overload but rejects `null` results with
 * `messages.requiredMessage`.
 */
export function instant(
  messages: FormRequiredMessage,
  ...actions: InstantAction[]
): ReturnType<typeof _instantRequired>;

export function instant(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: InstantAction[]) {
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
