import type {
  ToPlainDateTimeIssue,
  ToPlainDateTimeAction as BaseToPlainDateTimeAction,
} from '@thazstack/temporal-valibot-util';

import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

import { dayJS } from '#src/dayjs.config';

export interface ToPlainDateTimeAction<
  TInput,
  TMessage extends v.ErrorMessage<ToPlainDateTimeIssue<TInput>> | undefined,
> extends BaseToPlainDateTimeAction<TInput, TMessage> {
  reference: typeof toPlainDateTime;
}

/**
 * Convert value to a Temporal.PlainDateTime.
 *
 * @returns Temporal.PlainDateTime value.
 */
export function toPlainDateTime<TInput>(): ToPlainDateTimeAction<TInput, undefined>;

/**
 * Convert value to a Temporal.PlainDateTime.
 *
 * @param message The error message.
 *
 * @returns Temporal.PlainDateTime value.
 */
export function toPlainDateTime<
  TInput,
  const TMessage extends v.ErrorMessage<ToPlainDateTimeIssue<TInput>> | undefined,
>(message: TMessage): ToPlainDateTimeAction<TInput, TMessage>;

export function toPlainDateTime(
  message?: v.ErrorMessage<ToPlainDateTimeIssue<unknown>>,
): ToPlainDateTimeAction<unknown, v.ErrorMessage<ToPlainDateTimeIssue<unknown>> | undefined> {
  return {
    kind: 'transformation',
    type: 'to_plain_date_time',
    reference: toPlainDateTime,
    async: false,
    message,
    '~run'(dataset, config) {
      const { value } = dataset;

      try {
        if (dayJS.isDayjs(value)) {
          dataset.value = new Temporal.PlainDateTime(
            value.year(),
            value.month() + 1,
            value.date(),
            value.hour(),
            value.minute(),
            value.second(),
            value.millisecond(),
          );
        } else if (!(value instanceof Temporal.PlainDateTime)) {
          v._addIssue(this, 'plainDate', dataset, config, {
            received: '"Invalid conversion option"',
          });
          // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
          dataset.typed = false;
        }
      } catch {
        v._addIssue(this, 'plainDate', dataset, config);
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = false;
      }

      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return dataset as v.OutputDataset<Temporal.PlainDateTime, ToPlainDateTimeIssue<unknown>>;
    },
  };
}
