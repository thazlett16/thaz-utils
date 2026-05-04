import * as f from '@thazstack/form-util';
import * as t from '@thazstack/temporal-valibot-util';

import * as v from 'valibot';

import { isDayJSValid } from '#src/actions/is-dayjs-valid';
import { toPlainDate } from '#src/actions/to-plain-date-value';
import { dayjs } from '#src/schemas/dayjs';

export function _plainDateNullable(messages: f.FormWrongTypeMessage, ...actions: f.PlainDateAction[]) {
  return v.union(
    [
      f._plainDateNullable(messages, ...actions),
      v.pipe(
        dayjs(),
        isDayJSValid(messages.wrongTypeMessage),
        toPlainDate(messages.wrongTypeMessage),
        v.pipe(t.plainDate(), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

export function _plainDateRequired(messages: f.FormRequiredMessage, ...actions: f.PlainDateAction[]) {
  return v.pipe(_plainDateNullable(messages, ...actions), t.plainDate(messages.requiredMessage));
}

/**
 * PlainDate schema requires passing `wrongTypeMessage` and can be marked as a required variant schema by adding `requiredMessage`
 *
 * Accepts:
 *
 * `null`
 *
 * `undefined` -> `null`
 *
 * `Temporal.PlainDate`
 *
 * `Temporal.ZonedDateTime` -> `Temporal.PlainDate` via `.toPlainDate()`
 *
 * `Temporal.PlainDateTime` -> `Temporal.PlainDate` via `.toPlainDate()`
 *
 * `Dayjs` (valid) -> `Temporal.PlainDate` via year/month/day components
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
