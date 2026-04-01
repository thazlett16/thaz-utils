import { ZonedDateTime, parseZonedDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

export interface ToInternationalizedZonedDateTimeIssue<TInput> extends v.BaseIssue<TInput | ZonedDateTime> {
  kind: 'transformation';
  type: 'to_zoned_date_time';
  expected: null;
}

export interface ToInternationalizedZonedDateTimeAction<
  TInput,
  TMessage extends v.ErrorMessage<ToInternationalizedZonedDateTimeIssue<TInput>> | undefined,
> extends v.BaseTransformation<TInput, ZonedDateTime, ToInternationalizedZonedDateTimeIssue<TInput>> {
  type: 'to_zoned_date_time';
  reference: typeof toInternationalizedZonedDateTime;
  message: TMessage;
}

/**
 * Convert value to an @internationalized/date ZonedDateTime.
 *
 * @returns @internationalized/date ZonedDateTime value.
 */
export function toInternationalizedZonedDateTime<TInput>(): ToInternationalizedZonedDateTimeAction<TInput, undefined>;

/**
 * Convert value to an @internationalized/date ZonedDateTime.
 *
 * @param message The error message.
 *
 * @returns @internationalized/date ZonedDateTime value.
 */
export function toInternationalizedZonedDateTime<
  TInput,
  const TMessage extends v.ErrorMessage<ToInternationalizedZonedDateTimeIssue<TInput>> | undefined,
>(message: TMessage): ToInternationalizedZonedDateTimeAction<TInput, TMessage>;

export function toInternationalizedZonedDateTime(
  message?: v.ErrorMessage<ToInternationalizedZonedDateTimeIssue<unknown>>,
): ToInternationalizedZonedDateTimeAction<
  unknown,
  v.ErrorMessage<ToInternationalizedZonedDateTimeIssue<unknown>> | undefined
> {
  return {
    kind: 'transformation',
    type: 'to_zoned_date_time',
    reference: toInternationalizedZonedDateTime,
    async: false,
    message,
    '~run'(dataset, config) {
      try {
        if (typeof dataset.value === 'string') {
          dataset.value = parseZonedDateTime(dataset.value);
        } else if (dataset.value instanceof Temporal.ZonedDateTime) {
          dataset.value = parseZonedDateTime(dataset.value.toString());
        } else if (!(dataset.value instanceof ZonedDateTime)) {
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
      return dataset as v.OutputDataset<ZonedDateTime, ToInternationalizedZonedDateTimeIssue<unknown>>;
    },
  };
}
