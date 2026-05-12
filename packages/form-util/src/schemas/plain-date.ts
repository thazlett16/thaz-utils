import * as t from '@thazstack/temporal-valibot-util';

import type { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/schemas/types';
import { isFormRequiredMessage } from '#src/schemas/types';

export type PlainDateAction = v.BaseValidation<Temporal.PlainDate, Temporal.PlainDate, v.BaseIssue<unknown>>;

/**
 * Builds the nullable variant of the plain-date schema. Output type is `Temporal.PlainDate` | `null`.
 *
 * Accepts/Transforms as follows: `null` / `undefined` -> `null` / `Temporal.PlainDate` / `Temporal.ZonedDateTime` / `Temporal.PlainDateTime`
 *
 * @param messages - {@link FormWrongTypeMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.PlainDate` value.
 *
 * @returns A valibot union schema that outputs `Temporal.PlainDate` | `null`.
 */
export function _plainDateNullable(messages: FormWrongTypeMessage, ...actions: PlainDateAction[]) {
  return v.union(
    [
      v.null(),
      v.pipe(
        v.undefined(),
        v.transform(() => null),
      ),
      v.pipe(t.plainDate(messages.wrongTypeMessage), ...actions),
      v.pipe(
        t.zonedDateTime(messages.wrongTypeMessage),
        v.transform((val) => val.toPlainDate()),
        v.pipe(t.plainDate(messages.wrongTypeMessage), ...actions),
      ),
      v.pipe(
        t.plainDateTime(messages.wrongTypeMessage),
        v.transform((val) => val.toPlainDate()),
        v.pipe(t.plainDate(messages.wrongTypeMessage), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

/**
 * Builds the required variant of the plain-date schema. Asserts that the result is a non-null `Temporal.PlainDate`.
 *
 * Accepts/Transforms as follows: `null` / `undefined` / `Temporal.ZonedDateTime` / `Temporal.PlainDateTime` / `Temporal.PlainDate`
 *
 * @param messages - {@link FormRequiredMessage} providing both wrong-type and required error text.
 * @param actions - Additional valibot actions applied to the `Temporal.PlainDate` value.
 *
 * @returns A valibot pipe schema that outputs `Temporal.PlainDate`.
 */
export function _plainDateRequired(messages: FormRequiredMessage, ...actions: PlainDateAction[]) {
  return v.pipe(_plainDateNullable(messages), v.pipe(t.plainDate(messages.requiredMessage), ...actions));
}

/**
 * PlainDate schema requires passing `wrongTypeMessage` and can be marked as a required variant schema by adding `requiredMessage`.
 * Output type is `Temporal.PlainDate` | `null` or `Temporal.PlainDate` for required variant.
 *
 * Accepts/Transforms as follows: `null` / `undefined` / `Temporal.ZonedDateTime` / `Temporal.PlainDateTime` / `Temporal.PlainDate`
 *
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.PlainDate` value.
 *
 * @returns A valibot schema that outputs `Temporal.PlainDate` | `null` or `Temporal.PlainDate`.
 */
export function plainDate<T extends FormWrongTypeMessage | FormRequiredMessage>(
  messages: T,
  ...actions: PlainDateAction[]
): T extends FormRequiredMessage ? ReturnType<typeof _plainDateRequired> : ReturnType<typeof _plainDateNullable>;

/**
 * PlainDate schema requires passing `wrongTypeMessage` and can be marked as a required variant schema by adding `requiredMessage`.
 * Output type is `Temporal.PlainDate` | `null` or `Temporal.PlainDate` for required variant.
 *
 * Accepts/Transforms as follows: `null` / `undefined` / `Temporal.ZonedDateTime` / `Temporal.PlainDateTime` / `Temporal.PlainDate`
 *
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.PlainDate` value.
 *
 * @returns A valibot schema that outputs `Temporal.PlainDate` | `null` or `Temporal.PlainDate`.
 */
export function plainDate(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: PlainDateAction[]) {
  if (isFormRequiredMessage(messages)) {
    return _plainDateRequired(messages, ...actions);
  }

  return _plainDateNullable(messages, ...actions);
}
