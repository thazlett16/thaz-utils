import * as f from '@thazstack/form-util';
import * as t from '@thazstack/temporal-valibot-util';

import * as v from 'valibot';

import { toPlainDateTime } from '#src/actions/to-plain-date-time-value';
import { internationalizedCalendarDateTime } from '#src/schemas/intl-calendar-date-time';
import { internationalizedZonedDateTime } from '#src/schemas/intl-zoned-date-time';

export function _plainDateTimeNullable(messages: f.FormWrongTypeMessage, ...actions: f.PlainDateTimeAction[]) {
  return v.union(
    [
      f._plainDateTimeNullable(messages, ...actions),
      v.pipe(
        internationalizedZonedDateTime(messages.wrongTypeMessage),
        toPlainDateTime(messages.wrongTypeMessage),
        v.pipe(t.plainDateTime(messages.wrongTypeMessage), ...actions),
      ),
      v.pipe(
        internationalizedCalendarDateTime(messages.wrongTypeMessage),
        toPlainDateTime(messages.wrongTypeMessage),
        v.pipe(t.plainDateTime(messages.wrongTypeMessage), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

export function _plainDateTimeRequired(messages: f.FormRequiredMessage, ...actions: f.PlainDateTimeAction[]) {
  return v.pipe(_plainDateTimeNullable(messages, ...actions), t.plainDateTime(messages.requiredMessage));
}

/**
 * PlainDateTime schema requires passing `wrongTypeMessage` and can be marked as a required variant schema by adding `requiredMessage`
 *
 * Accepts:
 *
 * `null`
 *
 * `undefined` -> `null`
 *
 * `Temporal.PlainDateTime`
 *
 * `Temporal.ZonedDateTime` -> `Temporal.PlainDateTime` via `.toPlainDateTime()`
 *
 * `@internationalized/date ZonedDateTime` -> `Temporal.PlainDateTime`
 *
 * `@internationalized/date CalendarDateTime` -> `Temporal.PlainDateTime`
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
