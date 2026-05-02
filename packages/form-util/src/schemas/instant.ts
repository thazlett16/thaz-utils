import * as t from '@thazstack/temporal-valibot-util';

import type { Temporal } from '@js-temporal/polyfill';

import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/schemas/types';

import { isFormRequiredMessage } from '#src/schemas/types';

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
 * Instant schema requires passing `wrongTypeMessage` and can be marked as a required variant schema by adding `requiredMessage`
 *
 * Accepts:
 *
 * `null`
 *
 * `undefined` -> `null`
 *
 * `Temporal.Instant`
 *
 * `Temporal.ZonedDateTime` -> `Temporal.Instant` via `.toInstant()`
 */
export function instant<T extends FormWrongTypeMessage | FormRequiredMessage>(
  messages: T,
  ...actions: InstantAction[]
): T extends FormRequiredMessage ? ReturnType<typeof _instantRequired> : ReturnType<typeof _instantNullable>;

export function instant(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: InstantAction[]) {
  if (isFormRequiredMessage(messages)) {
    return _instantRequired(messages, ...actions);
  }

  return _instantNullable(messages, ...actions);
}
