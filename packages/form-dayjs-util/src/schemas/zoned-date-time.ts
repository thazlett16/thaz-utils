import * as f from '@thazstack/form-util';
import type { TimeZoneOptions } from '@thazstack/temporal-util';
import * as t from '@thazstack/temporal-valibot-util';

import * as v from 'valibot';

import { isDayJSValid } from '#src/actions/is-dayjs-valid';
import { toZonedDateTime } from '#src/actions/to-zoned-date-time-value';
import { dayjs } from '#src/schemas/dayjs';

/**
 * Builds the nullable variant of the zonedDateTime schema. Output type is `Temporal.ZonedDateTime` | `null`.
 *
 * Extends `@thazstack/form-util`'s zonedDateTime schema to also accept a valid `Dayjs` value,
 * converting it to `Temporal.ZonedDateTime` via ISO string + timezone from options.
 *
 * Accepts/Transforms as follows:
 * `null` / `undefined` → `null` / `Temporal.ZonedDateTime` / `Dayjs` (valid) → `Temporal.ZonedDateTime`
 *
 * @param options - {@link TimeZoneOptions} specifying the target timezone for `Dayjs` conversions.
 * @param messages - {@link FormWrongTypeMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.ZonedDateTime` value.
 *
 * @returns A valibot union schema that outputs `Temporal.ZonedDateTime` | `null`.
 */
export function _zonedDateTimeNullable(
  options: TimeZoneOptions,
  messages: f.FormWrongTypeMessage,
  ...actions: f.ZonedDateTimeAction[]
) {
  return v.union(
    [
      f._zonedDateTimeNullable(messages, ...actions),
      v.pipe(
        dayjs(messages.wrongTypeMessage),
        isDayJSValid(messages.wrongTypeMessage),
        toZonedDateTime(options, messages.wrongTypeMessage),
        v.pipe(t.zonedDateTime(messages.wrongTypeMessage), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

/**
 * Builds the required variant of the zonedDateTime schema. Asserts that the result is a non-null `Temporal.ZonedDateTime`.
 *
 * @param options - {@link TimeZoneOptions} specifying the target timezone for `Dayjs` conversions.
 * @param messages - {@link FormRequiredMessage} providing both wrong-type and required error text.
 * @param actions - Additional valibot actions applied to the `Temporal.ZonedDateTime` value.
 *
 * @returns A valibot pipe schema that outputs `Temporal.ZonedDateTime`.
 */
export function _zonedDateTimeRequired(
  options: TimeZoneOptions,
  messages: f.FormRequiredMessage,
  ...actions: f.ZonedDateTimeAction[]
) {
  return v.pipe(_zonedDateTimeNullable(options, messages, ...actions), t.zonedDateTime(messages.requiredMessage));
}

/**
 * ZonedDateTime schema requires passing `TimeZoneOptions` and `wrongTypeMessage`, and can be marked as a required variant schema by adding `requiredMessage`.
 * Output type is `Temporal.ZonedDateTime` | `null` or `Temporal.ZonedDateTime` for required variant.
 *
 * Accepts/Transforms as follows:
 * `null` / `undefined` → `null` / `Temporal.ZonedDateTime` / `Dayjs` (valid) → `Temporal.ZonedDateTime`
 * via ISO string + timezone from `options`
 *
 * @param options - {@link TimeZoneOptions} specifying the target timezone for `Dayjs` conversions.
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage}
 * @param actions - Additional valibot actions applied to the `Temporal.ZonedDateTime` value.
 *
 * @returns A valibot schema that outputs `Temporal.ZonedDateTime` | `null` (nullable) or `Temporal.ZonedDateTime` (required).
 */
export function zonedDateTime<T extends f.FormWrongTypeMessage | f.FormRequiredMessage>(
  options: TimeZoneOptions,
  messages: T,
  ...actions: f.ZonedDateTimeAction[]
): T extends f.FormRequiredMessage
  ? ReturnType<typeof _zonedDateTimeRequired>
  : ReturnType<typeof _zonedDateTimeNullable>;

export function zonedDateTime(
  options: TimeZoneOptions,
  messages: f.FormWrongTypeMessage | f.FormRequiredMessage,
  ...actions: f.ZonedDateTimeAction[]
) {
  if (f.isFormRequiredMessage(messages)) {
    return _zonedDateTimeRequired(options, messages, ...actions);
  }

  return _zonedDateTimeNullable(options, messages, ...actions);
}
