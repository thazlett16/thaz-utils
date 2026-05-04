import * as f from '@thazstack/form-util';
import * as t from '@thazstack/temporal-valibot-util';

import * as v from 'valibot';

import { isDayJSValid } from '#src/actions/is-dayjs-valid';
import { toInstant } from '#src/actions/to-instant-value';
import { dayjs } from '#src/schemas/dayjs';

export function _instantNullable(messages: f.FormWrongTypeMessage, ...actions: f.InstantAction[]) {
  return v.union(
    [
      f._instantNullable(messages, ...actions),
      v.pipe(
        dayjs(),
        isDayJSValid(messages.wrongTypeMessage),
        toInstant(messages.wrongTypeMessage),
        v.pipe(t.instant(), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

export function _instantRequired(messages: f.FormRequiredMessage, ...actions: f.InstantAction[]) {
  return v.pipe(_instantNullable(messages, ...actions), t.instant(messages.requiredMessage));
}

/**
 * Instant schema requires passing `wrongTypeMessage` and can be marked as a required variant schema by adding `requiredMessage`
 *
 * Accepts:
 *
 * `null`
 *
 * `undefined` -> `null`
 *
 * `Temporal.Instant`
 *
 * `Temporal.ZonedDateTime` -> `Temporal.Instant` via `.toInstant()`
 *
 * `Dayjs` (valid) -> `Temporal.Instant` via ISO string conversion
 */
export function instant<T extends f.FormWrongTypeMessage | f.FormRequiredMessage>(
  messages: T,
  ...actions: f.InstantAction[]
): T extends f.FormRequiredMessage ? ReturnType<typeof _instantRequired> : ReturnType<typeof _instantNullable>;

export function instant(messages: f.FormWrongTypeMessage | f.FormRequiredMessage, ...actions: f.InstantAction[]) {
  if (f.isFormRequiredMessage(messages)) {
    return _instantRequired(messages, ...actions);
  }

  return _instantNullable(messages, ...actions);
}
