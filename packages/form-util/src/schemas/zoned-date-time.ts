import * as t from '@thazstack/temporal-valibot-util';

import type { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/schemas/types';
import { isFormRequiredMessage } from '#src/schemas/types';

export type ZonedDateTimeAction = v.BaseValidation<
  Temporal.ZonedDateTime,
  Temporal.ZonedDateTime,
  v.BaseIssue<unknown>
>;

/**
 * Builds the nullable variant of the zoned-date-time schema. Output type is `Temporal.ZonedDateTime` | `null`.
 *
 * Accepts/Transforms as follows: `null` / `undefined` / `Temporal.ZonedDateTime`
 *
 * @param messages - {@link FormWrongTypeMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.ZonedDateTime` value.
 *
 * @returns A valibot union schema that outputs `Temporal.ZonedDateTime` | `null`.
 */
export function _zonedDateTimeNullable(messages: FormWrongTypeMessage, ...actions: ZonedDateTimeAction[]) {
  return v.union(
    [
      v.null(),
      v.pipe(
        v.undefined(),
        v.transform(() => null),
      ),
      v.pipe(t.zonedDateTime(messages.wrongTypeMessage), ...actions),
    ],
    messages.wrongTypeMessage,
  );
}

/**
 * Builds the required variant of the zoned-date-time schema. Asserts that the result is a non-null `Temporal.ZonedDateTime`.
 *
 * Accepts/Transforms as follows: `null` / `undefined` / `Temporal.ZonedDateTime`
 *
 * @param messages - {@link FormRequiredMessage} providing both wrong-type and required error text.
 * @param actions - Additional valibot actions applied to the `Temporal.ZonedDateTime` value.
 *
 * @returns A valibot pipe schema that outputs `Temporal.ZonedDateTime`.
 */
export function _zonedDateTimeRequired(messages: FormRequiredMessage, ...actions: ZonedDateTimeAction[]) {
  return v.pipe(_zonedDateTimeNullable(messages), v.pipe(t.zonedDateTime(messages.requiredMessage), ...actions));
}

/**
 * ZonedDateTime schema requires passing `wrongTypeMessage` and can be marked as a required variant schema by adding `requiredMessage`.
 * Output type is `Temporal.ZonedDateTime` | `null` or `Temporal.ZonedDateTime` for required variant.
 *
 * Accepts/Transforms as follows: `null` / `undefined` / `Temporal.ZonedDateTime`
 *
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.ZonedDateTime` value.
 *
 * @returns A valibot schema that outputs `Temporal.ZonedDateTime` | `null` or `Temporal.ZonedDateTime`.
 */
export function zonedDateTime<T extends FormWrongTypeMessage | FormRequiredMessage>(
  messages: T,
  ...actions: ZonedDateTimeAction[]
): T extends FormRequiredMessage
  ? ReturnType<typeof _zonedDateTimeRequired>
  : ReturnType<typeof _zonedDateTimeNullable>;

/**
 * ZonedDateTime schema requires passing `wrongTypeMessage` and can be marked as a required variant schema by adding `requiredMessage`.
 * Output type is `Temporal.ZonedDateTime` | `null` or `Temporal.ZonedDateTime` for required variant.
 *
 * Accepts/Transforms as follows: `null` / `undefined` / `Temporal.ZonedDateTime`
 *
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.ZonedDateTime` value.
 *
 * @returns A valibot schema that outputs `Temporal.ZonedDateTime` | `null` or `Temporal.ZonedDateTime`.
 */
export function zonedDateTime(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: ZonedDateTimeAction[]) {
  if (isFormRequiredMessage(messages)) {
    return _zonedDateTimeRequired(messages, ...actions);
  }

  return _zonedDateTimeNullable(messages, ...actions);
}
