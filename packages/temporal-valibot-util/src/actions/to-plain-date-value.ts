import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

/**
 * Issue raised when a value cannot be converted to a `Temporal.PlainDate`.
 */
export interface ToPlainDateIssue<TInput> extends v.BaseIssue<TInput | Temporal.PlainDate> {
  kind: 'transformation';
  type: 'to_plain_date';
  expected: null;
}

/**
 * Transformation action that converts a value to a `Temporal.PlainDate`.
 */
export interface ToPlainDateAction<
  TInput,
  TMessage extends v.ErrorMessage<ToPlainDateIssue<TInput>> | undefined,
> extends v.BaseTransformation<TInput, Temporal.PlainDate, ToPlainDateIssue<TInput>> {
  type: 'to_plain_date';
  reference: typeof toPlainDate;
  message: TMessage;
}

/**
 * Creates a transformation action that converts a value to a `Temporal.PlainDate`.
 *
 * Accepted input types and their conversions:
 * - `string` — parsed in order: `ZonedDateTime` → `PlainDateTime` → `PlainDate` ISO string.
 * - `Temporal.ZonedDateTime` — `.toPlainDate()` is called.
 * - `Temporal.PlainDateTime` — `.toPlainDate()` is called.
 * - `Temporal.PlainDate` — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @returns A `toPlainDate` transformation action.
 */
export function toPlainDate<TInput>(): ToPlainDateAction<TInput, undefined>;

/**
 * Creates a transformation action that converts a value to a `Temporal.PlainDate`.
 *
 * Accepted input types and their conversions:
 * - `string` — parsed in order: `ZonedDateTime` → `PlainDateTime` → `PlainDate` ISO string.
 * - `Temporal.ZonedDateTime` — `.toPlainDate()` is called.
 * - `Temporal.PlainDateTime` — `.toPlainDate()` is called.
 * - `Temporal.PlainDate` — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @param message The error message used when conversion fails.
 *
 * @returns A `toPlainDate` transformation action.
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
        if (typeof value === 'string') {
          try {
            dataset.value = Temporal.ZonedDateTime.from(value).toPlainDate();
          } catch {
            try {
              dataset.value = Temporal.PlainDateTime.from(value).toPlainDate();
            } catch {
              try {
                dataset.value = Temporal.PlainDate.from(value);
              } catch {
                v._addIssue(this, 'plainDate', dataset, config);
                // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
                dataset.typed = false;
              }
            }
          }
        } else if (value instanceof Temporal.ZonedDateTime) {
          dataset.value = value.toPlainDate();
        } else if (value instanceof Temporal.PlainDateTime) {
          dataset.value = value.toPlainDate();
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
