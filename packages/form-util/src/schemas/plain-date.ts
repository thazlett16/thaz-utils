import * as t from '@thazstack/temporal-valibot-util';

import type { Temporal } from '@js-temporal/polyfill';

import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/schemas/types';

import { isFormRequiredMessage } from '#src/schemas/types';

export type PlainDateAction = v.BaseValidation<Temporal.PlainDate, Temporal.PlainDate, v.BaseIssue<unknown>>;

export function _plainDateNullable(messages: FormWrongTypeMessage, ...actions: PlainDateAction[]) {
  return v.union(
    [
      v.null(),
      v.pipe(
        v.undefined(),
        v.transform(() => null),
      ),
      v.pipe(t.plainDate(), ...actions),
      v.pipe(
        t.zonedDateTime(),
        v.transform((val) => val.toPlainDate()),
        v.pipe(t.plainDate(), ...actions),
      ),
      v.pipe(
        t.plainDateTime(),
        v.transform((val) => val.toPlainDate()),
        v.pipe(t.plainDate(), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

export function _plainDateRequired(messages: FormRequiredMessage, ...actions: PlainDateAction[]) {
  return v.pipe(_plainDateNullable(messages), v.pipe(t.plainDate(messages.requiredMessage), ...actions));
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
 */
export function plainDate<T extends FormWrongTypeMessage | FormRequiredMessage>(
  messages: T,
  ...actions: PlainDateAction[]
): T extends FormRequiredMessage ? ReturnType<typeof _plainDateRequired> : ReturnType<typeof _plainDateNullable>;

export function plainDate(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: PlainDateAction[]) {
  if (isFormRequiredMessage(messages)) {
    return _plainDateRequired(messages, ...actions);
  }

  return _plainDateNullable(messages, ...actions);
}
