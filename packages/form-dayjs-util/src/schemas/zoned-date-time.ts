import * as f from '@thazstack/form-util';
import type { TimeZoneOptions } from '@thazstack/temporal-util';
import * as t from '@thazstack/temporal-valibot-util';

import * as v from 'valibot';

import { isDayJSValid } from '#src/actions/is-dayjs-valid';
import { toZonedDateTime } from '#src/actions/to-zoned-date-time-value';
import { dayjs } from '#src/schemas/dayjs';

export function _zonedDateTimeNullable(
  options: TimeZoneOptions,
  messages: f.FormWrongTypeMessage,
  ...actions: f.ZonedDateTimeAction[]
) {
  return v.union(
    [
      f._zonedDateTimeNullable(messages, ...actions),
      v.pipe(
        dayjs(),
        isDayJSValid(messages.wrongTypeMessage),
        toZonedDateTime(options, messages.wrongTypeMessage),
        v.pipe(t.zonedDateTime(), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

export function _zonedDateTimeRequired(
  options: TimeZoneOptions,
  messages: f.FormRequiredMessage,
  ...actions: f.ZonedDateTimeAction[]
) {
  return v.pipe(_zonedDateTimeNullable(options, messages, ...actions), t.zonedDateTime(messages.requiredMessage));
}

/**
 * ZonedDateTime schema requires passing `TimeZoneOptions` and `wrongTypeMessage`, and can be marked as a required variant schema by adding `requiredMessage`
 *
 * Accepts:
 *
 * `null`
 *
 * `undefined` -> `null`
 *
 * `Temporal.ZonedDateTime`
 *
 * `Dayjs` (valid) -> `Temporal.ZonedDateTime` via ISO string + timezone from options
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
