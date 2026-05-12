import * as t from '@thazstack/temporal-valibot-util';

import type { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/schemas/types';
import { isFormRequiredMessage } from '#src/schemas/types';

export type PlainDateTimeAction = v.BaseValidation<
  Temporal.PlainDateTime,
  Temporal.PlainDateTime,
  v.BaseIssue<unknown>
>;

/**
 * Builds the nullable variant of the plain-date-time schema. Output type is `Temporal.PlainDateTime` | `null`.
 *
 * Accepts/Transforms as follows: `null` / `undefined` -> `null` / `Temporal.PlainDateTime` / `Temporal.ZonedDateTime`
 *
 * @param messages - {@link FormWrongTypeMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.PlainDateTime` value.
 *
 * @returns A valibot union schema that outputs `Temporal.PlainDateTime` | `null`.
 */
export function _plainDateTimeNullable(messages: FormWrongTypeMessage, ...actions: PlainDateTimeAction[]) {
  return v.union(
    [
      v.null(),
      v.pipe(
        v.undefined(),
        v.transform(() => null),
      ),
      v.pipe(t.plainDateTime(messages.wrongTypeMessage), ...actions),
      v.pipe(
        t.zonedDateTime(messages.wrongTypeMessage),
        v.transform((val) => val.toPlainDateTime()),
        v.pipe(t.plainDateTime(messages.wrongTypeMessage), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

/**
 * Builds the required variant of the plain-date-time schema. Asserts that the result is a non-null `Temporal.PlainDateTime`.
 *
 * Accepts/Transforms as follows: `null` / `undefined` / `Temporal.ZonedDateTime` / `Temporal.PlainDateTime`
 *
 * @param messages - {@link FormRequiredMessage} providing both wrong-type and required error text.
 * @param actions - Additional valibot actions applied to the `Temporal.PlainDateTime` value.
 *
 * @returns A valibot pipe schema that outputs `Temporal.PlainDateTime`.
 */
export function _plainDateTimeRequired(messages: FormRequiredMessage, ...actions: PlainDateTimeAction[]) {
  return v.pipe(_plainDateTimeNullable(messages), v.pipe(t.plainDateTime(messages.requiredMessage), ...actions));
}

/**
 * PlainDateTime schema requires passing `wrongTypeMessage` and can be marked as a required variant schema by adding `requiredMessage`.
 * Output type is `Temporal.PlainDateTime` | `null` or `Temporal.PlainDateTime` for required variant.
 *
 * Accepts/Transforms as follows: `null` / `undefined` / `Temporal.ZonedDateTime` / `Temporal.PlainDateTime`
 *
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.PlainDateTime` value.
 *
 * @returns A valibot schema that outputs `Temporal.PlainDateTime` | `null` or `Temporal.PlainDateTime`.
 */
export function plainDateTime<T extends FormWrongTypeMessage | FormRequiredMessage>(
  messages: T,
  ...actions: PlainDateTimeAction[]
): T extends FormRequiredMessage
  ? ReturnType<typeof _plainDateTimeRequired>
  : ReturnType<typeof _plainDateTimeNullable>;

/**
 * PlainDateTime schema requires passing `wrongTypeMessage` and can be marked as a required variant schema by adding `requiredMessage`.
 * Output type is `Temporal.PlainDateTime` | `null` or `Temporal.PlainDateTime` for required variant.
 *
 * Accepts/Transforms as follows: `null` / `undefined` / `Temporal.ZonedDateTime` / `Temporal.PlainDateTime`
 *
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.PlainDateTime` value.
 *
 * @returns A valibot schema that outputs `Temporal.PlainDateTime` | `null` or `Temporal.PlainDateTime`.
 */
export function plainDateTime(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: PlainDateTimeAction[]) {
  if (isFormRequiredMessage(messages)) {
    return _plainDateTimeRequired(messages, ...actions);
  }

  return _plainDateTimeNullable(messages, ...actions);
}
