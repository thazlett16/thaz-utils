import * as f from '@thazstack/form-util';
import * as t from '@thazstack/temporal-valibot-util';

import * as v from 'valibot';

import { isDayJSValid } from '#src/actions/is-dayjs-valid';
import { toPlainDate } from '#src/actions/to-plain-date-value';
import { dayjs } from '#src/schemas/dayjs';

/**
 * Builds the nullable variant of the plainDate schema. Output type is `Temporal.PlainDate` | `null`.
 *
 * Extends `@thazstack/form-util`'s plainDate schema to also accept a valid `Dayjs` value,
 * converting it to `Temporal.PlainDate` via year/month/day components.
 *
 * Accepts/Transforms as follows:
 * `null` / `undefined` → `null` / `Temporal.PlainDate` / `Temporal.ZonedDateTime` / `Temporal.PlainDateTime` →
 * `Temporal.PlainDate` / `Dayjs` (valid) → `Temporal.PlainDate`
 *
 * @param messages - {@link FormWrongTypeMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.PlainDate` value.
 *
 * @returns A valibot union schema that outputs `Temporal.PlainDate` | `null`.
 */
export function _plainDateNullable(messages: f.FormWrongTypeMessage, ...actions: f.PlainDateAction[]) {
  return v.union(
    [
      f._plainDateNullable(messages, ...actions),
      v.pipe(
        dayjs(messages.wrongTypeMessage),
        isDayJSValid(messages.wrongTypeMessage),
        toPlainDate(messages.wrongTypeMessage),
        v.pipe(t.plainDate(messages.wrongTypeMessage), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

/**
 * Builds the required variant of the plainDate schema. Asserts that the result is a non-null `Temporal.PlainDate`.
 *
 * @param messages - {@link FormRequiredMessage} providing both wrong-type and required error text.
 * @param actions - Additional valibot actions applied to the `Temporal.PlainDate` value.
 *
 * @returns A valibot pipe schema that outputs `Temporal.PlainDate`.
 */
export function _plainDateRequired(messages: f.FormRequiredMessage, ...actions: f.PlainDateAction[]) {
  return v.pipe(_plainDateNullable(messages, ...actions), t.plainDate(messages.requiredMessage));
}

/**
 * PlainDate schema requires passing `wrongTypeMessage` and can be marked as a required variant schema by adding `requiredMessage`.
 * Output type is `Temporal.PlainDate` | `null` or `Temporal.PlainDate` for required variant.
 *
 * Accepts/Transforms as follows:
 * `null` / `undefined` → `null` / `Temporal.PlainDate` / `Temporal.ZonedDateTime` / `Temporal.PlainDateTime` →
 * `Temporal.PlainDate` / `Dayjs` (valid) → `Temporal.PlainDate` via year/month/day components
 *
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage}
 * @param actions - Additional valibot actions applied to the `Temporal.PlainDate` value.
 *
 * @returns A valibot schema that outputs `Temporal.PlainDate` | `null` (nullable) or `Temporal.PlainDate` (required).
 */
export function plainDate<T extends f.FormWrongTypeMessage | f.FormRequiredMessage>(
  messages: T,
  ...actions: f.PlainDateAction[]
): T extends f.FormRequiredMessage ? ReturnType<typeof _plainDateRequired> : ReturnType<typeof _plainDateNullable>;

export function plainDate(messages: f.FormWrongTypeMessage | f.FormRequiredMessage, ...actions: f.PlainDateAction[]) {
  if (f.isFormRequiredMessage(messages)) {
    return _plainDateRequired(messages, ...actions);
  }

  return _plainDateNullable(messages, ...actions);
}
