import * as t from '@thazstack/temporal-valibot-util';

import type { Temporal } from '@js-temporal/polyfill';

import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/schemas/types';

import { isFormRequiredMessage } from '#src/schemas/types';

export type ZonedDateTimeAction = v.BaseValidation<
  Temporal.ZonedDateTime,
  Temporal.ZonedDateTime,
  v.BaseIssue<unknown>
>;

export function _zonedDateTimeNullable(messages: FormWrongTypeMessage, ...actions: ZonedDateTimeAction[]) {
  return v.union(
    [
      v.null(),
      v.pipe(
        v.undefined(),
        v.transform(() => null),
      ),
      v.pipe(t.zonedDateTime(), ...actions),
    ],
    messages.wrongTypeMessage,
  );
}

export function _zonedDateTimeRequired(messages: FormRequiredMessage, ...actions: ZonedDateTimeAction[]) {
  return v.pipe(_zonedDateTimeNullable(messages), v.pipe(t.zonedDateTime(messages.requiredMessage), ...actions));
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
 */
export function zonedDateTime<T extends FormWrongTypeMessage | FormRequiredMessage>(
  messages: T,
  ...actions: ZonedDateTimeAction[]
): T extends FormRequiredMessage ? ReturnType<typeof _zonedDateTimeRequired> : ReturnType<typeof _zonedDateTimeNullable>;

export function zonedDateTime(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: ZonedDateTimeAction[]) {
  if (isFormRequiredMessage(messages)) {
    return _zonedDateTimeRequired(messages, ...actions);
  }

  return _zonedDateTimeNullable(messages, ...actions);
}
