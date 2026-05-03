import * as f from '@thazstack/form-util';
import * as t from '@thazstack/temporal-valibot-util';

import * as v from 'valibot';

import { toZonedDateTime } from '#src/actions/to-zoned-date-time-value';
import { internationalizedZonedDateTime } from '#src/schemas/intl-zoned-date-time';

export function _zonedDateTimeNullable(messages: f.FormWrongTypeMessage, ...actions: f.ZonedDateTimeAction[]) {
  return v.union(
    [
      f._zonedDateTimeNullable(messages, ...actions),
      v.pipe(
        internationalizedZonedDateTime(),
        toZonedDateTime(messages.wrongTypeMessage),
        v.pipe(t.zonedDateTime(), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

export function _zonedDateTimeRequired(messages: f.FormRequiredMessage, ...actions: f.ZonedDateTimeAction[]) {
  return v.pipe(_zonedDateTimeNullable(messages, ...actions), t.zonedDateTime(messages.requiredMessage));
}

/**
 * ZonedDateTime schema requires passing `wrongTypeMessage` and can be marked as a required variant schema by adding `requiredMessage`
 *
 * Accepts:
 *
 * `null`
 *
 * `undefined` -> `null`
 *
 * `Temporal.ZonedDateTime`
 *
 * `@internationalized/date ZonedDateTime` -> `Temporal.ZonedDateTime` via string conversion
 */
export function zonedDateTime<T extends f.FormWrongTypeMessage | f.FormRequiredMessage>(
  messages: T,
  ...actions: f.ZonedDateTimeAction[]
): T extends f.FormRequiredMessage ? ReturnType<typeof _zonedDateTimeRequired> : ReturnType<typeof _zonedDateTimeNullable>;

export function zonedDateTime(
  messages: f.FormWrongTypeMessage | f.FormRequiredMessage,
  ...actions: f.ZonedDateTimeAction[]
) {
  if (f.isFormRequiredMessage(messages)) {
    return _zonedDateTimeRequired(messages, ...actions);
  }

  return _zonedDateTimeNullable(messages, ...actions);
}
