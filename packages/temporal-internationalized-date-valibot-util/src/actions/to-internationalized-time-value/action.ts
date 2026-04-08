import {
    Time,
    parseTime,
    parseZonedDateTime,
    ZonedDateTime,
    toTime,
    parseDateTime,
    CalendarDateTime,
} from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

export interface ToInternationalizedTimeIssue<TInput> extends v.BaseIssue<TInput | Time> {
    kind: 'transformation';
    type: 'to_time';
    expected: null;
}

export interface ToInternationalizedTimeAction<
    TInput,
    TMessage extends v.ErrorMessage<ToInternationalizedTimeIssue<TInput>> | undefined,
> extends v.BaseTransformation<TInput, Time, ToInternationalizedTimeIssue<TInput>> {
    type: 'to_time';
    reference: typeof toInternationalizedTime;
    message: TMessage;
}

/**
 * Convert value to an @internationalized/date Time.
 *
 * @returns @internationalized/date Time value.
 */
export function toInternationalizedTime<TInput>(): ToInternationalizedTimeAction<TInput, undefined>;

/**
 * Convert value to an @internationalized/date Time.
 *
 * @param message The error message.
 *
 * @returns @internationalized/date Time value.
 */
export function toInternationalizedTime<
    TInput,
    const TMessage extends v.ErrorMessage<ToInternationalizedTimeIssue<TInput>> | undefined,
>(message: TMessage): ToInternationalizedTimeAction<TInput, TMessage>;

export function toInternationalizedTime(
    message?: v.ErrorMessage<ToInternationalizedTimeIssue<unknown>>,
): ToInternationalizedTimeAction<unknown, v.ErrorMessage<ToInternationalizedTimeIssue<unknown>> | undefined> {
    return {
        kind: 'transformation',
        type: 'to_time',
        reference: toInternationalizedTime,
        async: false,
        message,
        '~run'(dataset, config) {
            try {
                if (typeof dataset.value === 'string') {
                    dataset.value = parseTime(dataset.value);
                } else if (dataset.value instanceof Temporal.ZonedDateTime) {
                    dataset.value = toTime(parseZonedDateTime(dataset.value.toString()));
                } else if (dataset.value instanceof Temporal.PlainDateTime) {
                    dataset.value = toTime(parseDateTime(dataset.value.toString()));
                } else if (dataset.value instanceof Temporal.PlainTime) {
                    dataset.value = parseTime(dataset.value.toString());
                } else if (dataset.value instanceof ZonedDateTime) {
                    dataset.value = toTime(dataset.value);
                } else if (dataset.value instanceof CalendarDateTime) {
                    dataset.value = toTime(dataset.value);
                } else if (!(dataset.value instanceof Time)) {
                    v._addIssue(this, 'time', dataset, config, {
                        received: '"Invalid conversion option"',
                    });
                    // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
                    dataset.typed = false;
                }
            } catch {
                v._addIssue(this, 'time', dataset, config);
                // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
                dataset.typed = false;
            }

            // oxlint-disable-next-line typescript/no-unsafe-type-assertion
            return dataset as v.OutputDataset<Time, ToInternationalizedTimeIssue<unknown>>;
        },
    };
}
