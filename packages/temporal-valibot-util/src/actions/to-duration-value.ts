import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

/**
 * Issue raised when a value cannot be converted to a `Temporal.Duration`.
 */
export interface ToDurationIssue<TInput> extends v.BaseIssue<TInput | Temporal.Duration> {
  kind: 'transformation';
  type: 'to_duration';
  expected: null;
}

/**
 * Transformation action that converts a value to a `Temporal.Duration`.
 */
export interface ToDurationAction<
  TInput,
  TMessage extends v.ErrorMessage<ToDurationIssue<TInput>> | undefined,
> extends v.BaseTransformation<TInput, Temporal.Duration, ToDurationIssue<TInput>> {
  type: 'to_duration';
  reference: typeof toDuration;
  message: TMessage;
}

/**
 * Options for the `toDuration` transformation action.
 */
export interface ToDurationOptions {
  /**
   * The duration component field to populate when the input is a number.
   *
   * For example, `{ durationType: 'hours' }` maps the number `2` to
   * `Temporal.Duration.from({ hours: 2 })`.
   */
  durationType:
    | 'years'
    | 'months'
    | 'days'
    | 'hours'
    | 'minutes'
    | 'seconds'
    | 'milliseconds'
    | 'microseconds'
    | 'nanoseconds';
}

/**
 * Creates a transformation action that converts a number or `Temporal.Duration` to a
 * `Temporal.Duration`. Numbers are mapped to the duration component specified by
 * `options.durationType`. Existing `Temporal.Duration` values pass through unchanged.
 * All other input types produce a validation issue.
 *
 * @param options Specifies which duration component to use when converting a number.
 *
 * @returns A `toDuration` transformation action.
 */
export function toDuration<TInput>(options: ToDurationOptions): ToDurationAction<TInput, undefined>;

/**
 * Creates a transformation action that converts a number or `Temporal.Duration` to a
 * `Temporal.Duration`. Numbers are mapped to the duration component specified by
 * `options.durationType`. Existing `Temporal.Duration` values pass through unchanged.
 * All other input types produce a validation issue.
 *
 * @param options Specifies which duration component to use when converting a number.
 * @param message The error message used when conversion fails.
 *
 * @returns A `toDuration` transformation action.
 */
export function toDuration<TInput, const TMessage extends v.ErrorMessage<ToDurationIssue<TInput>> | undefined>(
  options: ToDurationOptions,
  message: TMessage,
): ToDurationAction<TInput, TMessage>;

export function toDuration(
  options: ToDurationOptions,
  message?: v.ErrorMessage<ToDurationIssue<unknown>>,
): ToDurationAction<unknown, v.ErrorMessage<ToDurationIssue<unknown>> | undefined> {
  const { durationType } = options;

  return {
    kind: 'transformation',
    type: 'to_duration',
    reference: toDuration,
    async: false,
    message,
    '~run'(dataset, config) {
      const { value } = dataset;

      try {
        if (typeof value === 'number') {
          dataset.value = Temporal.Duration.from({
            [durationType]: value,
          });
        } else if (!(value instanceof Temporal.Duration)) {
          v._addIssue(this, 'duration', dataset, config, {
            received: '"Invalid conversion option"',
          });
          // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
          dataset.typed = false;
        }
      } catch {
        v._addIssue(this, 'duration', dataset, config);
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = false;
      }

      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return dataset as v.OutputDataset<Temporal.Duration, ToDurationIssue<unknown>>;
    },
  };
}
