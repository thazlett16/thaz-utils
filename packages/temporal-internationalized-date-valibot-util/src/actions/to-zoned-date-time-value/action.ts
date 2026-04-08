import type { ToZonedDateTimeIssue, ToZonedDateTimeAction } from '@thazstack/temporal-valibot-util';

import { ZonedDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

export interface ToZonedDateTimeDayJSAction<
    TInput,
    TMessage extends v.ErrorMessage<ToZonedDateTimeIssue<TInput>> | undefined,
> extends ToZonedDateTimeAction<TInput, TMessage> {
    reference: typeof toZonedDateTime;
}

/**
 * Convert value to a Temporal.ZonedDateTime.
 *
 * @returns A Temporal.ZonedDateTime value.
 */
export function toZonedDateTime<TInput>(): ToZonedDateTimeDayJSAction<TInput, undefined>;

/**
 * Convert value to a Temporal.ZonedDateTime.
 *
 * @param message The error message.
 *
 * @returns A max value action.
 */
export function toZonedDateTime<
    TInput,
    const TMessage extends v.ErrorMessage<ToZonedDateTimeIssue<TInput>> | undefined,
>(message: TMessage): ToZonedDateTimeDayJSAction<TInput, TMessage>;

export function toZonedDateTime(
    message?: v.ErrorMessage<ToZonedDateTimeIssue<unknown>>,
): ToZonedDateTimeDayJSAction<unknown, v.ErrorMessage<ToZonedDateTimeIssue<unknown>> | undefined> {
    return {
        kind: 'transformation',
        type: 'to_zoned_date_time',
        reference: toZonedDateTime,
        async: false,
        message,
        '~run'(dataset, config) {
            try {
                if (dataset.value instanceof ZonedDateTime) {
                    dataset.value = Temporal.ZonedDateTime.from(dataset.value.toString());
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
