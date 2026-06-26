import * as f from '@thazstack/form-util';
import * as t from '@thazstack/temporal-valibot-util';

import * as v from 'valibot';

import { isDayJSValid } from '#src/actions/is-dayjs-valid';
import { toPlainDateTime } from '#src/actions/to-plain-date-time-value';
import { dayjs } from '#src/schemas/dayjs';

/**
 * Builds the nullable variant of the plainDateTime schema. Output type is `Temporal.PlainDateTime` | `null`.
 *
 * Extends `@thazstack/form-util`'s plainDateTime schema to also accept a valid `Dayjs` value,
 * converting it to `Temporal.PlainDateTime` via date/time components.
 *
 * Accepts/Transforms as follows:
 * `null` / `undefined` → `null` / `Temporal.PlainDateTime` / `Temporal.ZonedDateTime` → `Temporal.PlainDateTime` /
 * `Dayjs` (valid) → `Temporal.PlainDateTime`
 *
 * @param messages - {@link FormWrongTypeMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.PlainDateTime` value.
 *
 * @returns A valibot union schema that outputs `Temporal.PlainDateTime` | `null`.
 */
export function _plainDateTimeNullable(messages: f.FormWrongTypeMessage, ...actions: f.PlainDateTimeAction[]) {
  return v.union(
    [
      f._plainDateTimeNullable(messages, ...actions),
      v.pipe(
        dayjs(messages.wrongTypeMessage),
        isDayJSValid(messages.wrongTypeMessage),
        toPlainDateTime(messages.wrongTypeMessage),
        v.pipe(t.plainDateTime(messages.wrongTypeMessage), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

/**
 * Builds the required variant of the plainDateTime schema. Asserts that the result is a non-null `Temporal.PlainDateTime`.
 *
 * @param messages - {@link FormRequiredMessage} providing both wrong-type and required error text.
 * @param actions - Additional valibot actions applied to the `Temporal.PlainDateTime` value.
 *
 * @returns A valibot pipe schema that outputs `Temporal.PlainDateTime`.
 */
export function _plainDateTimeRequired(messages: f.FormRequiredMessage, ...actions: f.PlainDateTimeAction[]) {
  return v.pipe(_plainDateTimeNullable(messages, ...actions), t.plainDateTime(messages.requiredMessage));
}

/**
 * PlainDateTime schema requires passing `wrongTypeMessage` and can be marked as a required variant schema by adding `requiredMessage`.
 * Output type is `Temporal.PlainDateTime` | `null` or `Temporal.PlainDateTime` for required variant.
 *
 * Accepts/Transforms as follows:
 * `null` / `undefined` → `null` / `Temporal.PlainDateTime` / `Temporal.ZonedDateTime` → `Temporal.PlainDateTime` /
 * `Dayjs` (valid) → `Temporal.PlainDateTime` via date/time components
 *
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage}
 * @param actions - Additional valibot actions applied to the `Temporal.PlainDateTime` value.
 *
 * @returns A valibot schema that outputs `Temporal.PlainDateTime` | `null` (nullable) or `Temporal.PlainDateTime` (required).
 */
export function plainDateTime<T extends f.FormWrongTypeMessage | f.FormRequiredMessage>(
  messages: T,
  ...actions: f.PlainDateTimeAction[]
): T extends f.FormRequiredMessage
  ? ReturnType<typeof _plainDateTimeRequired>
  : ReturnType<typeof _plainDateTimeNullable>;

export function plainDateTime(
  messages: f.FormWrongTypeMessage | f.FormRequiredMessage,
  ...actions: f.PlainDateTimeAction[]
) {
  if (f.isFormRequiredMessage(messages)) {
    return _plainDateTimeRequired(messages, ...actions);
  }

  return _plainDateTimeNullable(messages, ...actions);
}
