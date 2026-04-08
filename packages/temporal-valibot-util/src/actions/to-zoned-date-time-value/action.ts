import { Temporal } from '@js-temporal/polyfill';
import { getDefaultTimeZone } from '@thazstack/temporal-util';
import * as v from 'valibot';

export interface ToZonedDateTimeIssue<TInput> extends v.BaseIssue<TInput | Temporal.ZonedDateTime> {
    kind: 'transformation';
    type: 'to_zoned_date_time';
    expected: null;
}

export interface ToZonedDateTimeAction<
    TInput,
    TMessage extends v.ErrorMessage<ToZonedDateTimeIssue<TInput>> | undefined,
> extends v.BaseTransformation<TInput, Temporal.ZonedDateTime, ToZonedDateTimeIssue<TInput>> {
    type: 'to_zoned_date_time';
    reference: typeof toZonedDateTime;
    message: TMessage;
}

export interface ToZonedDateTimeOptions {
    timezone?: string;
}

/**
 * Convert value to a Temporal.ZonedDateTime.
 *
 * @param options Options to convert values to a ZonedDateTime
 *
 * @returns A Temporal.ZonedDateTime value.
 */
export function toZonedDateTime<TInput>(options?: ToZonedDateTimeOptions): ToZonedDateTimeAction<TInput, undefined>;

/**
 * Convert value to a Temporal.ZonedDateTime.
 *
 * @param options Options to convert values to a ZonedDateTime
 * @param message The error message.
 *
 * @returns A max value action.
 */
export function toZonedDateTime<
    TInput,
    const TMessage extends v.ErrorMessage<ToZonedDateTimeIssue<TInput>> | undefined,
>(options: ToZonedDateTimeOptions, message: TMessage): ToZonedDateTimeAction<TInput, TMessage>;

export function toZonedDateTime(
    options: ToZonedDateTimeOptions = {},
    message?: v.ErrorMessage<ToZonedDateTimeIssue<unknown>>,
): ToZonedDateTimeAction<unknown, v.ErrorMessage<ToZonedDateTimeIssue<unknown>> | undefined> {
    const timeZone = options.timezone ?? getDefaultTimeZone();

    return {
        kind: 'transformation',
        type: 'to_zoned_date_time',
        reference: toZonedDateTime,
        async: false,
        message,
        '~run'(dataset, config) {
            try {
                if (typeof dataset.value === 'string') {
                    const { value } = dataset;

                    try {
                        dataset.value = Temporal.ZonedDateTime.from(value);
                    } catch {
                        try {
                            dataset.value = Temporal.Instant.from(value).toZonedDateTimeISO(timeZone);
                        } catch {
                            v._addIssue(this, 'zonedDateTime', dataset, config);
                            // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
                            dataset.typed = false;
                        }
                    }
                } else if (typeof dataset.value === 'number') {
                    dataset.value = Temporal.Instant.fromEpochMilliseconds(dataset.value).toZonedDateTimeISO(timeZone);
                } else if (typeof dataset.value === 'bigint') {
                    dataset.value = Temporal.Instant.fromEpochNanoseconds(dataset.value).toZonedDateTimeISO(timeZone);
                } else if (dataset.value instanceof Temporal.Instant) {
                    dataset.value = dataset.value.toZonedDateTimeISO(timeZone);
                } else if (dataset.value instanceof Date) {
                    dataset.value = Temporal.Instant.fromEpochMilliseconds(dataset.value.getTime()).toZonedDateTimeISO(
                        timeZone,
                    );
                } else if (!(dataset.value instanceof Temporal.ZonedDateTime)) {
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
