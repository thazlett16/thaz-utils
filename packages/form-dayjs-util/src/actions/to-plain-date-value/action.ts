import type { ToPlainDateIssue, ToPlainDateAction as BaseToPlainDateAction } from '@thazstack/temporal-valibot-util';

import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

import { dayJS } from '#src/dayjs.config';

export interface ToPlainDateAction<
  TInput,
  TMessage extends v.ErrorMessage<ToPlainDateIssue<TInput>> | undefined,
> extends BaseToPlainDateAction<TInput, TMessage> {
  reference: typeof toPlainDate;
}

/**
 * Convert value to a Temporal.PlainDate.
 *
 * @returns Temporal.PlainDate value.
 */
export function toPlainDate<TInput>(): ToPlainDateAction<TInput, undefined>;

/**
 * Convert value to a Temporal.PlainDate.
 *
 * @param message The error message.
 *
 * @returns Temporal.PlainDate value.
 */
export function toPlainDate<TInput, const TMessage extends v.ErrorMessage<ToPlainDateIssue<TInput>> | undefined>(
  message: TMessage,
): ToPlainDateAction<TInput, TMessage>;

export function toPlainDate(
  message?: v.ErrorMessage<ToPlainDateIssue<unknown>>,
): ToPlainDateAction<unknown, v.ErrorMessage<ToPlainDateIssue<unknown>> | undefined> {
  return {
    kind: 'transformation',
    type: 'to_plain_date',
    reference: toPlainDate,
    async: false,
    message,
    '~run'(dataset, config) {
      const { value } = dataset;

      try {
        if (dayJS.isDayjs(value)) {
          dataset.value = new Temporal.PlainDate(value.year(), value.month() + 1, value.date());
        } else if (!(value instanceof Temporal.PlainDate)) {
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
      return dataset as v.OutputDataset<Temporal.PlainDate, ToPlainDateIssue<unknown>>;
    },
  };
}
