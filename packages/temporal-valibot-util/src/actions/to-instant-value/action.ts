import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

export interface ToInstantIssue<TInput> extends v.BaseIssue<TInput | Temporal.Instant> {
  kind: 'transformation';
  type: 'to_instant';
  expected: null;
}

export interface ToInstantAction<
  TInput,
  TMessage extends v.ErrorMessage<ToInstantIssue<TInput>> | undefined,
> extends v.BaseTransformation<TInput, Temporal.Instant, ToInstantIssue<TInput>> {
  type: 'to_instant';
  reference: typeof toInstant;
  message: TMessage;
}

/**
 * Convert value to a Temporal.Instant.
 *
 * @returns Temporal.Instant value.
 */
export function toInstant<TInput>(): ToInstantAction<TInput, undefined>;

/**
 * Convert value to a Temporal.Instant.
 *
 * @param message The error message.
 *
 * @returns Temporal.Instant value.
 */
export function toInstant<TInput, const TMessage extends v.ErrorMessage<ToInstantIssue<TInput>> | undefined>(
  message: TMessage,
): ToInstantAction<TInput, TMessage>;

export function toInstant(
  message?: v.ErrorMessage<ToInstantIssue<unknown>>,
): ToInstantAction<unknown, v.ErrorMessage<ToInstantIssue<unknown>> | undefined> {
  return {
    kind: 'transformation',
    type: 'to_instant',
    reference: toInstant,
    async: false,
    message,
    '~run'(dataset, config) {
      const { value } = dataset;

      try {
        if (typeof value === 'string') {
          try {
            dataset.value = Temporal.ZonedDateTime.from(value).toInstant();
          } catch {
            try {
              dataset.value = Temporal.Instant.from(value);
            } catch {
              v._addIssue(this, 'instant', dataset, config);
              // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
              dataset.typed = false;
            }
          }
        } else if (typeof value === 'number') {
          dataset.value = Temporal.Instant.fromEpochMilliseconds(value);
        } else if (typeof value === 'bigint') {
          dataset.value = Temporal.Instant.fromEpochNanoseconds(value);
        } else if (value instanceof Date) {
          dataset.value = Temporal.Instant.fromEpochMilliseconds(value.getTime());
        } else if (value instanceof Temporal.ZonedDateTime) {
          dataset.value = value.toInstant();
        } else if (!(value instanceof Temporal.Instant)) {
          v._addIssue(this, 'instant', dataset, config, {
            received: '"Invalid conversion option"',
          });
          // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
          dataset.typed = false;
        }
      } catch {
        v._addIssue(this, 'instant', dataset, config);
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = false;
      }

      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return dataset as v.OutputDataset<Temporal.Instant, ToInstantIssue<unknown>>;
    },
  };
}
