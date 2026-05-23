import * as f from '@thazstack/form-util';
import * as t from '@thazstack/temporal-valibot-util';

import * as v from 'valibot';

import { isDayJSValid } from '#src/actions/is-dayjs-valid';
import { toInstant } from '#src/actions/to-instant-value';
import { dayjs } from '#src/schemas/dayjs';

/**
 * Builds the nullable variant of the instant schema. Output type is `Temporal.Instant` | `null`.
 *
 * Extends `@thazstack/form-util`'s instant schema to also accept a valid `Dayjs` value,
 * converting it to `Temporal.Instant` via ISO string.
 *
 * Accepts/Transforms as follows:
 * `null` / `undefined` → `null` / `Temporal.Instant` / `Temporal.ZonedDateTime` → `Temporal.Instant` /
 * `Dayjs` (valid) → `Temporal.Instant`
 *
 * @param messages - {@link FormWrongTypeMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.Instant` value.
 *
 * @returns A valibot union schema that outputs `Temporal.Instant` | `null`.
 */
export function _instantNullable(messages: f.FormWrongTypeMessage, ...actions: f.InstantAction[]) {
  return v.union(
    [
      f._instantNullable(messages, ...actions),
      v.pipe(
        dayjs(messages.wrongTypeMessage),
        isDayJSValid(messages.wrongTypeMessage),
        toInstant(messages.wrongTypeMessage),
        v.pipe(t.instant(messages.wrongTypeMessage), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

/**
 * Builds the required variant of the instant schema. Asserts that the result is a non-null `Temporal.Instant`.
 *
 * @param messages - {@link FormRequiredMessage} providing both wrong-type and required error text.
 * @param actions - Additional valibot actions applied to the `Temporal.Instant` value.
 *
 * @returns A valibot pipe schema that outputs `Temporal.Instant`.
 */
export function _instantRequired(messages: f.FormRequiredMessage, ...actions: f.InstantAction[]) {
  return v.pipe(_instantNullable(messages, ...actions), t.instant(messages.requiredMessage));
}

/**
 * Instant schema requires passing `wrongTypeMessage` and can be marked as a required variant schema by adding `requiredMessage`.
 * Output type is `Temporal.Instant` | `null` or `Temporal.Instant` for required variant.
 *
 * Accepts/Transforms as follows:
 * `null` / `undefined` → `null` / `Temporal.Instant` / `Temporal.ZonedDateTime` → `Temporal.Instant` /
 * `Dayjs` (valid) → `Temporal.Instant` via ISO string conversion
 *
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage}
 * @param actions - Additional valibot actions applied to the `Temporal.Instant` value.
 *
 * @returns A valibot schema that outputs `Temporal.Instant` | `null` (nullable) or `Temporal.Instant` (required).
 */
export function instant<T extends f.FormWrongTypeMessage | f.FormRequiredMessage>(
  messages: T,
  ...actions: f.InstantAction[]
): T extends f.FormRequiredMessage ? ReturnType<typeof _instantRequired> : ReturnType<typeof _instantNullable>;

export function instant(messages: f.FormWrongTypeMessage | f.FormRequiredMessage, ...actions: f.InstantAction[]) {
  if (f.isFormRequiredMessage(messages)) {
    return _instantRequired(messages, ...actions);
  }

  return _instantNullable(messages, ...actions);
}
