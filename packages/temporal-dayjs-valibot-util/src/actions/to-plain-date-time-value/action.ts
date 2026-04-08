import type { ToPlainDateTimeIssue, ToPlainDateTimeAction } from '@thazstack/temporal-valibot-util';

import { Temporal } from '@js-temporal/polyfill';
import { convertDayJSToPlainDateTime } from '@thazstack/temporal-dayjs-util';
import * as v from 'valibot';

import { dayJS } from '#src/dayjs.config';

export interface ToPlainDateTimeDayJSAction<
    TInput,
    TMessage extends v.ErrorMessage<ToPlainDateTimeIssue<TInput>> | undefined,
> extends ToPlainDateTimeAction<TInput, TMessage> {
    reference: typeof toPlainDateTime;
}

/**
 * Convert value to a Temporal.PlainDateTime.
 *
 * @returns A Temporal.PlainDateTime value.
 */
export function toPlainDateTime<TInput>(): ToPlainDateTimeDayJSAction<TInput, undefined>;

/**
 * Convert value to a Temporal.PlainDateTime.
 *
 * @param message The error message.
 *
 * @returns A max value action.
 */
export function toPlainDateTime<
    TInput,
    const TMessage extends v.ErrorMessage<ToPlainDateTimeIssue<TInput>> | undefined,
>(message: TMessage): ToPlainDateTimeDayJSAction<TInput, TMessage>;

export function toPlainDateTime(
    message?: v.ErrorMessage<ToPlainDateTimeIssue<unknown>>,
): ToPlainDateTimeDayJSAction<unknown, v.ErrorMessage<ToPlainDateTimeIssue<unknown>> | undefined> {
    return {
        kind: 'transformation',
        type: 'to_plain_date_time',
        reference: toPlainDateTime,
        async: false,
        message,
        '~run'(dataset, config) {
            try {
                if (dayJS.isDayjs(dataset.value)) {
                    dataset.value = convertDayJSToPlainDateTime(dataset.value);
                } else if (!(dataset.value instanceof Temporal.PlainDateTime)) {
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
            return dataset as v.OutputDataset<Temporal.PlainDateTime, ToPlainDateTimeIssue<unknown>>;
        },
    };
}
