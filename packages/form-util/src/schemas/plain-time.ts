import * as t from '@thazstack/temporal-valibot-util';

import type { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/schemas/types';
import { isFormRequiredMessage } from '#src/schemas/types';

export type PlainTimeAction = v.BaseValidation<Temporal.PlainTime, Temporal.PlainTime, v.BaseIssue<unknown>>;

/**
 * Builds the nullable variant of the plain-time schema. Output type is `Temporal.PlainTime` | `null`.
 *
 * Accepts/Transforms as follows: `null` / `undefined` -> `null` / `Temporal.PlainTime` / `Temporal.ZonedDateTime` / `Temporal.PlainDateTime`
 *
 * @param messages - {@link FormWrongTypeMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.PlainTime` value.
 *
 * @returns A valibot union schema that outputs `Temporal.PlainTime` | `null`.
 */
export function _plainTimeNullable(messages: FormWrongTypeMessage, ...actions: PlainTimeAction[]) {
  return v.union(
    [
      v.null(),
      v.pipe(
        v.undefined(),
        v.transform(() => null),
      ),
      v.pipe(t.plainTime(messages.wrongTypeMessage), ...actions),
      v.pipe(
        t.zonedDateTime(messages.wrongTypeMessage),
        v.transform((val) => val.toPlainTime()),
        v.pipe(t.plainTime(messages.wrongTypeMessage), ...actions),
      ),
      v.pipe(
        t.plainDateTime(messages.wrongTypeMessage),
        v.transform((val) => val.toPlainTime()),
        v.pipe(t.plainTime(messages.wrongTypeMessage), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

/**
 * Builds the required variant of the plain-time schema. Asserts that the result is a non-null `Temporal.PlainTime`.
 *
 * Accepts/Transforms as follows: `null` / `undefined` / `Temporal.ZonedDateTime` / `Temporal.PlainDateTime` / `Temporal.PlainTime`
 *
 * @param messages - {@link FormRequiredMessage} providing both wrong-type and required error text.
 * @param actions - Additional valibot actions applied to the `Temporal.PlainTime` value.
 *
 * @returns A valibot pipe schema that outputs `Temporal.PlainTime`.
 */
export function _plainTimeRequired(messages: FormRequiredMessage, ...actions: PlainTimeAction[]) {
  return v.pipe(_plainTimeNullable(messages), v.pipe(t.plainTime(messages.requiredMessage), ...actions));
}

/**
 * PlainTime schema requires passing `wrongTypeMessage` and can be marked as a required variant schema by adding `requiredMessage`.
 * Output type is `Temporal.PlainTime` | `null` or `Temporal.PlainTime` for required variant.
 *
 * Accepts/Transforms as follows: `null` / `undefined` / `Temporal.ZonedDateTime` / `Temporal.PlainDateTime` / `Temporal.PlainTime`
 *
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.PlainTime` value.
 *
 * @returns A valibot schema that outputs `Temporal.PlainTime` | `null` or `Temporal.PlainTime`.
 */
export function plainTime<T extends FormWrongTypeMessage | FormRequiredMessage>(
  messages: T,
  ...actions: PlainTimeAction[]
): T extends FormRequiredMessage ? ReturnType<typeof _plainTimeRequired> : ReturnType<typeof _plainTimeNullable>;

/**
 * PlainTime schema requires passing `wrongTypeMessage` and can be marked as a required variant schema by adding `requiredMessage`.
 * Output type is `Temporal.PlainTime` | `null` or `Temporal.PlainTime` for required variant.
 *
 * Accepts/Transforms as follows: `null` / `undefined` / `Temporal.ZonedDateTime` / `Temporal.PlainDateTime` / `Temporal.PlainTime`
 *
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.PlainTime` value.
 *
 * @returns A valibot schema that outputs `Temporal.PlainTime` | `null` or `Temporal.PlainTime`.
 */
export function plainTime(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: PlainTimeAction[]) {
  if (isFormRequiredMessage(messages)) {
    return _plainTimeRequired(messages, ...actions);
  }

  return _plainTimeNullable(messages, ...actions);
}
