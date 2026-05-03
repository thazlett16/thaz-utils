import * as f from '@thazstack/form-util';
import * as t from '@thazstack/temporal-valibot-util';

import * as v from 'valibot';

import { toPlainTime } from '#src/actions/to-plain-time-value';
import { internationalizedCalendarDateTime } from '#src/schemas/intl-calendar-date-time';
import { internationalizedTime } from '#src/schemas/intl-time';
import { internationalizedZonedDateTime } from '#src/schemas/intl-zoned-date-time';

export function _plainTimeNullable(messages: f.FormWrongTypeMessage, ...actions: f.PlainTimeAction[]) {
  return v.union(
    [
      f._plainTimeNullable(messages, ...actions),
      v.pipe(
        internationalizedZonedDateTime(),
        toPlainTime(messages.wrongTypeMessage),
        v.pipe(t.plainTime(), ...actions),
      ),
      v.pipe(
        internationalizedCalendarDateTime(),
        toPlainTime(messages.wrongTypeMessage),
        v.pipe(t.plainTime(), ...actions),
      ),
      v.pipe(internationalizedTime(), toPlainTime(messages.wrongTypeMessage), v.pipe(t.plainTime(), ...actions)),
    ],
    messages.wrongTypeMessage,
  );
}

export function _plainTimeRequired(messages: f.FormRequiredMessage, ...actions: f.PlainTimeAction[]) {
  return v.pipe(_plainTimeNullable(messages, ...actions), t.plainTime(messages.requiredMessage));
}

/**
 * PlainTime schema requires passing `wrongTypeMessage` and can be marked as a required variant schema by adding `requiredMessage`
 *
 * Accepts:
 *
 * `null`
 *
 * `undefined` -> `null`
 *
 * `Temporal.PlainTime`
 *
 * `Temporal.ZonedDateTime` -> `Temporal.PlainTime` via `.toPlainTime()`
 *
 * `Temporal.PlainDateTime` -> `Temporal.PlainTime` via `.toPlainTime()`
 *
 * `@internationalized/date ZonedDateTime` -> `Temporal.PlainTime`
 *
 * `@internationalized/date CalendarDateTime` -> `Temporal.PlainTime`
 *
 * `@internationalized/date Time` -> `Temporal.PlainTime`
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
