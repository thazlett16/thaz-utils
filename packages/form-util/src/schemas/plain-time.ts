import * as t from '@thazstack/temporal-valibot-util';

import type { Temporal } from '@js-temporal/polyfill';

import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/schemas/types';

import { isFormRequiredMessage } from '#src/schemas/types';

export type PlainTimeAction = v.BaseValidation<Temporal.PlainTime, Temporal.PlainTime, v.BaseIssue<unknown>>;

export function _plainTimeNullable(messages: FormWrongTypeMessage, ...actions: PlainTimeAction[]) {
  return v.union(
    [
      v.null(),
      v.pipe(
        v.undefined(),
        v.transform(() => null),
      ),
      v.pipe(t.plainTime(), ...actions),
      v.pipe(
        t.zonedDateTime(),
        v.transform((val) => val.toPlainTime()),
        v.pipe(t.plainTime(), ...actions),
      ),
      v.pipe(
        t.plainDateTime(),
        v.transform((val) => val.toPlainTime()),
        v.pipe(t.plainTime(), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

export function _plainTimeRequired(messages: FormRequiredMessage, ...actions: PlainTimeAction[]) {
  return v.pipe(_plainTimeNullable(messages), v.pipe(t.plainTime(messages.requiredMessage), ...actions));
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
 */
export function plainTime<T extends FormWrongTypeMessage | FormRequiredMessage>(
  messages: T,
  ...actions: PlainTimeAction[]
): T extends FormRequiredMessage ? ReturnType<typeof _plainTimeRequired> : ReturnType<typeof _plainTimeNullable>;

export function plainTime(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: PlainTimeAction[]) {
  if (isFormRequiredMessage(messages)) {
    return _plainTimeRequired(messages, ...actions);
  }

  return _plainTimeNullable(messages, ...actions);
}
