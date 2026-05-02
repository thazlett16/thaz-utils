import * as t from '@thazstack/temporal-valibot-util';

import type { Temporal } from '@js-temporal/polyfill';

import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/schemas/types';

import { isFormRequiredMessage } from '#src/schemas/types';

export type PlainDateTimeAction = v.BaseValidation<
  Temporal.PlainDateTime,
  Temporal.PlainDateTime,
  v.BaseIssue<unknown>
>;

export function _plainDateTimeNullable(messages: FormWrongTypeMessage, ...actions: PlainDateTimeAction[]) {
  return v.union(
    [
      v.null(),
      v.pipe(
        v.undefined(),
        v.transform(() => null),
      ),
      v.pipe(t.plainDateTime(), ...actions),
      v.pipe(
        t.zonedDateTime(),
        v.transform((val) => val.toPlainDateTime()),
        v.pipe(t.plainDateTime(), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

export function _plainDateTimeRequired(messages: FormRequiredMessage, ...actions: PlainDateTimeAction[]) {
  return v.pipe(_plainDateTimeNullable(messages), v.pipe(t.plainDateTime(messages.requiredMessage), ...actions));
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
 */
export function plainDateTime<T extends FormWrongTypeMessage | FormRequiredMessage>(
  messages: T,
  ...actions: PlainDateTimeAction[]
): T extends FormRequiredMessage ? ReturnType<typeof _plainDateTimeRequired> : ReturnType<typeof _plainDateTimeNullable>;

export function plainDateTime(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: PlainDateTimeAction[]) {
  if (isFormRequiredMessage(messages)) {
    return _plainDateTimeRequired(messages, ...actions);
  }

  return _plainDateTimeNullable(messages, ...actions);
}
