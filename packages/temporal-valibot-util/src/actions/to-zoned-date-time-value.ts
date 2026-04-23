import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

/**
 * Issue raised when a value cannot be converted to a `Temporal.ZonedDateTime`.
 */
export interface ToZonedDateTimeIssue<TInput> extends v.BaseIssue<TInput | Temporal.ZonedDateTime> {
  kind: 'transformation';
  type: 'to_zoned_date_time';
  expected: null;
}

/**
 * Transformation action that converts a value to a `Temporal.ZonedDateTime`.
 */
export interface ToZonedDateTimeAction<
  TInput,
  TMessage extends v.ErrorMessage<ToZonedDateTimeIssue<TInput>> | undefined,
> extends v.BaseTransformation<TInput, Temporal.ZonedDateTime, ToZonedDateTimeIssue<TInput>> {
  type: 'to_zoned_date_time';
  reference: typeof toZonedDateTime;
  message: TMessage;
}

/**
 * Creates a transformation action that converts a value to a `Temporal.ZonedDateTime`.
 *
 * Accepted input types and their conversions:
 * - `string` — parsed as a `ZonedDateTime` ISO 8601 string (must include timezone annotation,
 *   e.g. `'2024-01-01T00:00:00+00:00[UTC]'`).
 * - `Temporal.ZonedDateTime` — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @returns A `toZonedDateTime` transformation action.
 */
export function toZonedDateTime<TInput>(): ToZonedDateTimeAction<TInput, undefined>;

/**
 * Creates a transformation action that converts a value to a `Temporal.ZonedDateTime`.
 *
 * Accepted input types and their conversions:
 * - `string` — parsed as a `ZonedDateTime` ISO 8601 string (must include timezone annotation,
 *   e.g. `'2024-01-01T00:00:00+00:00[UTC]'`).
 * - `Temporal.ZonedDateTime` — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @param message The error message used when conversion fails.
 *
 * @returns A `toZonedDateTime` transformation action.
 */
export function toZonedDateTime<
  TInput,
  const TMessage extends v.ErrorMessage<ToZonedDateTimeIssue<TInput>> | undefined,
>(message: TMessage): ToZonedDateTimeAction<TInput, TMessage>;

export function toZonedDateTime(
  message?: v.ErrorMessage<ToZonedDateTimeIssue<unknown>>,
): ToZonedDateTimeAction<unknown, v.ErrorMessage<ToZonedDateTimeIssue<unknown>> | undefined> {
  return {
    kind: 'transformation',
    type: 'to_zoned_date_time',
    reference: toZonedDateTime,
    async: false,
    message,
    '~run'(dataset, config) {
      const { value } = dataset;

      try {
        if (typeof value === 'string') {
          try {
            dataset.value = Temporal.ZonedDateTime.from(value);
          } catch {
            v._addIssue(this, 'zonedDateTime', dataset, config);
            // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
            dataset.typed = false;
          }
        } else if (!(value instanceof Temporal.ZonedDateTime)) {
          v._addIssue(this, 'zonedDateTime', dataset, config, {
            received: '"Invalid conversion option"',
          });
          // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
          dataset.typed = false;
        }
      } catch {
        v._addIssue(this, 'zonedDateTime', dataset, config);
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = false;
      }

      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return dataset as v.OutputDataset<Temporal.ZonedDateTime, ToZonedDateTimeIssue<unknown>>;
    },
  };
}
