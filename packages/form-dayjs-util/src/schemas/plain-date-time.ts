import * as f from '@thazstack/form-util';
import * as t from '@thazstack/temporal-valibot-util';

import * as v from 'valibot';

import { isDayJSValid } from '#src/actions/is-dayjs-valid';
import { toPlainDateTime } from '#src/actions/to-plain-date-time-value';
import { dayjs } from '#src/schemas/dayjs';

export function _plainDateTimeNullable(messages: f.FormWrongTypeMessage, ...actions: f.PlainDateTimeAction[]) {
  return v.union(
    [
      f._plainDateTimeNullable(messages, ...actions),
      v.pipe(
        dayjs(),
        isDayJSValid(messages.wrongTypeMessage),
        toPlainDateTime(messages.wrongTypeMessage),
        v.pipe(t.plainDateTime(), ...actions),
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
 * `Dayjs` (valid) -> `Temporal.PlainDateTime` via date/time components
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
