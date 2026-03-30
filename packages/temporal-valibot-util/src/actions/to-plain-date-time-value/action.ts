import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

export interface ToPlainDateTimeIssue<TInput> extends v.BaseIssue<TInput | Temporal.PlainDateTime> {
  kind: 'transformation';
  type: 'to_plain_date_time';
  expected: null;
}

export interface ToPlainDateTimeAction<
  TInput,
  TMessage extends v.ErrorMessage<ToPlainDateTimeIssue<TInput>> | undefined,
> extends v.BaseTransformation<TInput, Temporal.PlainDateTime, ToPlainDateTimeIssue<TInput>> {
  type: 'to_plain_date_time';
  reference: typeof toPlainDateTime;
  message: TMessage;
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
      try {
        if (typeof dataset.value === 'string') {
          const { value } = dataset;

          try {
            dataset.value = Temporal.ZonedDateTime.from(value).toPlainDateTime();
          } catch {
            try {
              dataset.value = Temporal.PlainDateTime.from(value);
            } catch {
              v._addIssue(this, 'plainDateTime', dataset, config);
              // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
              dataset.typed = false;
            }
          }
        } else if (dataset.value instanceof Temporal.ZonedDateTime) {
          dataset.value = dataset.value.toPlainDateTime();
        } else if (!(dataset.value instanceof Temporal.PlainDateTime)) {
          v._addIssue(this, 'plainDateTime', dataset, config, {
            received: '"Invalid conversion option"',
          });
          // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
          dataset.typed = false;
        }
      } catch {
        v._addIssue(this, 'plainDateTime', dataset, config);
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = false;
      }

      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return dataset as v.OutputDataset<Temporal.PlainDateTime, ToPlainDateTimeIssue<unknown>>;
    },
  };
}
