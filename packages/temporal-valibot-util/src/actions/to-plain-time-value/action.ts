import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

export interface ToPlainTimeIssue<TInput> extends v.BaseIssue<TInput | Temporal.PlainTime> {
  kind: 'transformation';
  type: 'to_plain_time';
  expected: null;
}

export interface ToPlainTimeAction<
  TInput,
  TMessage extends v.ErrorMessage<ToPlainTimeIssue<TInput>> | undefined,
> extends v.BaseTransformation<TInput, Temporal.PlainTime, ToPlainTimeIssue<TInput>> {
  type: 'to_plain_time';
  reference: typeof toPlainTime;
  message: TMessage;
}

/**
 * Convert value to a Temporal.PlainTime.
 *
 * @returns Temporal.PlainTime value.
 */
export function toPlainTime<TInput>(): ToPlainTimeAction<TInput, undefined>;

/**
 * Convert value to a Temporal.PlainTime.
 *
 * @param message The error message.
 *
 * @returns Temporal.PlainTime value.
 */
export function toPlainTime<TInput, const TMessage extends v.ErrorMessage<ToPlainTimeIssue<TInput>> | undefined>(
  message: TMessage,
): ToPlainTimeAction<TInput, TMessage>;

export function toPlainTime(
  message?: v.ErrorMessage<ToPlainTimeIssue<unknown>>,
): ToPlainTimeAction<unknown, v.ErrorMessage<ToPlainTimeIssue<unknown>> | undefined> {
  return {
    kind: 'transformation',
    type: 'to_plain_time',
    reference: toPlainTime,
    async: false,
    message,
    '~run'(dataset, config) {
      const { value } = dataset;

      try {
        if (typeof value === 'string') {
          try {
            dataset.value = Temporal.ZonedDateTime.from(value).toPlainTime();
          } catch {
            try {
              dataset.value = Temporal.PlainDateTime.from(value).toPlainTime();
            } catch {
              try {
                dataset.value = Temporal.PlainTime.from(value);
              } catch {
                v._addIssue(this, 'plainTime', dataset, config);
                // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
                dataset.typed = false;
              }
            }
          }
        } else if (value instanceof Temporal.ZonedDateTime) {
          dataset.value = value.toPlainTime();
        } else if (value instanceof Temporal.PlainDateTime) {
          dataset.value = value.toPlainTime();
        } else if (!(value instanceof Temporal.PlainTime)) {
          v._addIssue(this, 'plainTime', dataset, config, {
            received: '"Invalid conversion option"',
          });
          // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
          dataset.typed = false;
        }
      } catch {
        v._addIssue(this, 'plainTime', dataset, config);
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = false;
      }

      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return dataset as v.OutputDataset<Temporal.PlainTime, ToPlainTimeIssue<unknown>>;
    },
  };
}
