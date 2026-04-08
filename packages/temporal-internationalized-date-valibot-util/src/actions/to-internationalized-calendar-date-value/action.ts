import {
    CalendarDate,
    parseDate,
    parseZonedDateTime,
    ZonedDateTime,
    toCalendarDate,
    parseDateTime,
    CalendarDateTime,
} from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

export interface ToInternationalizedCalendarDateIssue<TInput> extends v.BaseIssue<TInput | CalendarDate> {
    kind: 'transformation';
    type: 'to_calendar_date';
    expected: null;
}

export interface ToInternationalizedCalendarDateAction<
    TInput,
    TMessage extends v.ErrorMessage<ToInternationalizedCalendarDateIssue<TInput>> | undefined,
> extends v.BaseTransformation<TInput, CalendarDate, ToInternationalizedCalendarDateIssue<TInput>> {
    type: 'to_calendar_date';
    reference: typeof toInternationalizedCalendarDate;
    message: TMessage;
}

/**
 * Convert value to an @internationalized/date CalendarDate.
 *
 * @returns @internationalized/date CalendarDate value.
 */
export function toInternationalizedCalendarDate<TInput>(): ToInternationalizedCalendarDateAction<TInput, undefined>;

/**
 * Convert value to an @internationalized/date CalendarDate.
 *
 * @param message The error message.
 *
 * @returns @internationalized/date CalendarDate value.
 */
export function toInternationalizedCalendarDate<
    TInput,
    const TMessage extends v.ErrorMessage<ToInternationalizedCalendarDateIssue<TInput>> | undefined,
>(message: TMessage): ToInternationalizedCalendarDateAction<TInput, TMessage>;

export function toInternationalizedCalendarDate(
    message?: v.ErrorMessage<ToInternationalizedCalendarDateIssue<unknown>>,
): ToInternationalizedCalendarDateAction<
    unknown,
    v.ErrorMessage<ToInternationalizedCalendarDateIssue<unknown>> | undefined
> {
    return {
        kind: 'transformation',
        type: 'to_calendar_date',
        reference: toInternationalizedCalendarDate,
        async: false,
        message,
        '~run'(dataset, config) {
            try {
                if (typeof dataset.value === 'string') {
                    dataset.value = parseDate(dataset.value);
                } else if (dataset.value instanceof Temporal.ZonedDateTime) {
                    dataset.value = toCalendarDate(parseZonedDateTime(dataset.value.toString()));
                } else if (dataset.value instanceof Temporal.PlainDateTime) {
                    dataset.value = toCalendarDate(parseDateTime(dataset.value.toString()));
                } else if (dataset.value instanceof Temporal.PlainDate) {
                    dataset.value = parseDate(dataset.value.toString());
                } else if (dataset.value instanceof ZonedDateTime) {
                    dataset.value = toCalendarDate(dataset.value);
                } else if (dataset.value instanceof CalendarDateTime) {
                    dataset.value = toCalendarDate(dataset.value);
                } else if (!(dataset.value instanceof CalendarDate)) {
                    v._addIssue(this, 'calendarDate', dataset, config, {
                        received: '"Invalid conversion option"',
                    });
                    // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
                    dataset.typed = false;
                }
            } catch {
                v._addIssue(this, 'calendarDate', dataset, config);
                // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
                dataset.typed = false;
            }

            // oxlint-disable-next-line typescript/no-unsafe-type-assertion
            return dataset as v.OutputDataset<CalendarDate, ToInternationalizedCalendarDateIssue<unknown>>;
        },
    };
}
