import * as f from '@thazstack/form-util';
import * as t from '@thazstack/temporal-valibot-util';

import * as v from 'valibot';

import { isDayJSValid } from '#src/actions/is-dayjs-valid';
import { toPlainTime } from '#src/actions/to-plain-time-value';
import { dayjs } from '#src/schemas/dayjs';

/**
 * Builds the nullable variant of the plainTime schema. Output type is `Temporal.PlainTime` | `null`.
 *
 * Extends `@thazstack/form-util`'s plainTime schema to also accept a valid `Dayjs` value,
 * converting it to `Temporal.PlainTime` via hour/minute/second/millisecond components.
 *
 * Accepts/Transforms as follows:
 * `null` / `undefined` → `null` / `Temporal.PlainTime` / `Temporal.ZonedDateTime` / `Temporal.PlainDateTime` →
 * `Temporal.PlainTime` / `Dayjs` (valid) → `Temporal.PlainTime`
 *
 * @param messages - {@link FormWrongTypeMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.PlainTime` value.
 *
 * @returns A valibot union schema that outputs `Temporal.PlainTime` | `null`.
 */
export function _plainTimeNullable(messages: f.FormWrongTypeMessage, ...actions: f.PlainTimeAction[]) {
  return v.union(
    [
      f._plainTimeNullable(messages, ...actions),
      v.pipe(
        dayjs(messages.wrongTypeMessage),
        isDayJSValid(messages.wrongTypeMessage),
        toPlainTime(messages.wrongTypeMessage),
        v.pipe(t.plainTime(messages.wrongTypeMessage), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

/**
 * Builds the required variant of the plainTime schema. Asserts that the result is a non-null `Temporal.PlainTime`.
 *
 * @param messages - {@link FormRequiredMessage} providing both wrong-type and required error text.
 * @param actions - Additional valibot actions applied to the `Temporal.PlainTime` value.
 *
 * @returns A valibot pipe schema that outputs `Temporal.PlainTime`.
 */
export function _plainTimeRequired(messages: f.FormRequiredMessage, ...actions: f.PlainTimeAction[]) {
  return v.pipe(_plainTimeNullable(messages, ...actions), t.plainTime(messages.requiredMessage));
}

/**
 * PlainTime schema requires passing `wrongTypeMessage` and can be marked as a required variant schema by adding `requiredMessage`.
 * Output type is `Temporal.PlainTime` | `null` or `Temporal.PlainTime` for required variant.
 *
 * Accepts/Transforms as follows:
 * `null` / `undefined` → `null` / `Temporal.PlainTime` / `Temporal.ZonedDateTime` / `Temporal.PlainDateTime` →
 * `Temporal.PlainTime` / `Dayjs` (valid) → `Temporal.PlainTime` via hour/minute/second/millisecond components
 *
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage}
 * @param actions - Additional valibot actions applied to the `Temporal.PlainTime` value.
 *
 * @returns A valibot schema that outputs `Temporal.PlainTime` | `null` (nullable) or `Temporal.PlainTime` (required).
 */
export function plainTime<T extends f.FormWrongTypeMessage | f.FormRequiredMessage>(
  messages: T,
  ...actions: f.PlainTimeAction[]
): T extends f.FormRequiredMessage ? ReturnType<typeof _plainTimeRequired> : ReturnType<typeof _plainTimeNullable>;

export function plainTime(messages: f.FormWrongTypeMessage | f.FormRequiredMessage, ...actions: f.PlainTimeAction[]) {
  if (f.isFormRequiredMessage(messages)) {
    return _plainTimeRequired(messages, ...actions);
  }

  return _plainTimeNullable(messages, ...actions);
}
