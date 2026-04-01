import {
  CalendarDateTime,
  parseDateTime,
  parseZonedDateTime,
  ZonedDateTime,
  toCalendarDateTime,
} from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

export interface ToInternationalizedCalendarDateTimeIssue<TInput> extends v.BaseIssue<TInput | CalendarDateTime> {
  kind: 'transformation';
  type: 'to_calendar_date_time';
  expected: null;
}

export interface ToInternationalizedCalendarDateTimeAction<
  TInput,
  TMessage extends v.ErrorMessage<ToInternationalizedCalendarDateTimeIssue<TInput>> | undefined,
> extends v.BaseTransformation<TInput, CalendarDateTime, ToInternationalizedCalendarDateTimeIssue<TInput>> {
  type: 'to_calendar_date_time';
  reference: typeof toInternationalizedCalendarDateTime;
  message: TMessage;
}

/**
 * Convert value to an @internationalized/date CalendarDateTime.
 *
 * @returns @internationalized/date CalendarDateTime value.
 */
export function toInternationalizedCalendarDateTime<TInput>(): ToInternationalizedCalendarDateTimeAction<
  TInput,
  undefined
>;

/**
 * Convert value to an @internationalized/date CalendarDateTime.
 *
 * @param message The error message.
 *
 * @returns @internationalized/date CalendarDateTime value.
 */
export function toInternationalizedCalendarDateTime<
  TInput,
  const TMessage extends v.ErrorMessage<ToInternationalizedCalendarDateTimeIssue<TInput>> | undefined,
>(message: TMessage): ToInternationalizedCalendarDateTimeAction<TInput, TMessage>;

export function toInternationalizedCalendarDateTime(
  message?: v.ErrorMessage<ToInternationalizedCalendarDateTimeIssue<unknown>>,
): ToInternationalizedCalendarDateTimeAction<
  unknown,
  v.ErrorMessage<ToInternationalizedCalendarDateTimeIssue<unknown>> | undefined
> {
  return {
    kind: 'transformation',
    type: 'to_calendar_date_time',
    reference: toInternationalizedCalendarDateTime,
    async: false,
    message,
    '~run'(dataset, config) {
      const { value } = dataset;

      try {
        if (typeof value === 'string') {
          dataset.value = parseDateTime(value);
        } else if (value instanceof Temporal.ZonedDateTime) {
          dataset.value = toCalendarDateTime(parseZonedDateTime(value.toString()));
        } else if (value instanceof Temporal.PlainDateTime) {
          dataset.value = parseDateTime(value.toString());
        } else if (value instanceof ZonedDateTime) {
          dataset.value = toCalendarDateTime(value);
        } else if (!(value instanceof CalendarDateTime)) {
          v._addIssue(this, 'calendarDateTime', dataset, config, {
            received: '"Invalid conversion option"',
          });
          // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
          dataset.typed = false;
        }
      } catch {
        v._addIssue(this, 'calendarDateTime', dataset, config);
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = false;
      }

      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return dataset as v.OutputDataset<CalendarDateTime, ToInternationalizedCalendarDateTimeIssue<unknown>>;
    },
  };
}
