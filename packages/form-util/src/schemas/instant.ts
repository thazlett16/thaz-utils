import * as t from '@thazstack/temporal-valibot-util';

import type { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/schemas/types';
import { isFormRequiredMessage } from '#src/schemas/types';

export type InstantAction = v.BaseValidation<Temporal.Instant, Temporal.Instant, v.BaseIssue<unknown>>;

/**
 * Builds the nullable variant of the instant schema. Output type is `Temporal.Instant` | `null`.
 *
 * Accepts/Transforms as follows: `null` / `undefined` -> `null` / `Temporal.ZonedDateTime` / `Temporal.Instant`
 *
 * @param messages - {@link FormWrongTypeMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.Instant` value.
 *
 * @returns A valibot union schema that outputs `Temporal.Instant` | `null`.
 */
export function _instantNullable(messages: FormWrongTypeMessage, ...actions: InstantAction[]) {
  return v.union(
    [
      v.null(),
      v.pipe(
        v.undefined(),
        v.transform(() => null),
      ),
      v.pipe(t.instant(messages.wrongTypeMessage), ...actions),
      v.pipe(
        t.zonedDateTime(messages.wrongTypeMessage),
        v.transform((val) => val.toInstant()),
        v.pipe(t.instant(messages.wrongTypeMessage), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

/**
 * Builds the required variant of the instant schema. Asserts that the result is a non-null `Temporal.Instant`
 *
 * Accepts/Transforms as follows: `null` / `undefined` / `Temporal.ZonedDateTime` / `Temporal.Instant`
 *
 * @param messages - {@link FormWrongTypeMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.Instant` value.
 *
 * @returns A valibot union schema that outputs `Temporal.Instant`.
 */
export function _instantRequired(messages: FormRequiredMessage, ...actions: InstantAction[]) {
  return v.pipe(_instantNullable(messages), v.pipe(t.instant(messages.requiredMessage), ...actions));
}

/**
 * Instant schema requires passing `wrongTypeMessage` and can be marked as a required variant schema by adding `requiredMessage`.
 * Output type is `Temporal.Instant` | `null` or `Temporal.Instant` for required variant.
 *
 * Accepts/Transforms as follows: `null` / `undefined` / `Temporal.ZonedDateTime` / `Temporal.Instant`
 *
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.Instant` value.
 *
 * @returns A valibot union schema that outputs `Temporal.Instant`.
 */
export function instant<T extends FormWrongTypeMessage | FormRequiredMessage>(
  messages: T,
  ...actions: InstantAction[]
): T extends FormRequiredMessage ? ReturnType<typeof _instantRequired> : ReturnType<typeof _instantNullable>;

/**
 * Instant schema requires passing `wrongTypeMessage` and can be marked as a required variant schema by adding `requiredMessage`.
 * Output type is `Temporal.Instant` | `null` or `Temporal.Instant` for required variant.
 *
 * Accepts/Transforms as follows: `null` / `undefined` / `Temporal.ZonedDateTime` / `Temporal.Instant`
 *
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.Instant` value.
 *
 * @returns A valibot union schema that outputs `Temporal.Instant`.
 */
export function instant(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: InstantAction[]) {
  if (isFormRequiredMessage(messages)) {
    return _instantRequired(messages, ...actions);
  }

  return _instantNullable(messages, ...actions);
}
