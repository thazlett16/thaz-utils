import type { ToPlainDateIssue, ToPlainDateAction } from '@thazstack/temporal-valibot-util';

import { ZonedDateTime, CalendarDate, CalendarDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

export interface ToPlainDateDayJSAction<
    TInput,
    TMessage extends v.ErrorMessage<ToPlainDateIssue<TInput>> | undefined,
> extends ToPlainDateAction<TInput, TMessage> {
    reference: typeof toPlainDate;
}

/**
 * Convert value to a Temporal.PlainDate.
 *
 * @returns A Temporal.PlainDate value.
 */
export function toPlainDate<TInput>(): ToPlainDateDayJSAction<TInput, undefined>;

/**
 * Convert value to a Temporal.PlainDate.
 *
 * @param message The error message.
 *
 * @returns A max value action.
 */
export function toPlainDate<TInput, const TMessage extends v.ErrorMessage<ToPlainDateIssue<TInput>> | undefined>(
    message: TMessage,
): ToPlainDateDayJSAction<TInput, TMessage>;

export function toPlainDate(
    message?: v.ErrorMessage<ToPlainDateIssue<unknown>>,
): ToPlainDateDayJSAction<unknown, v.ErrorMessage<ToPlainDateIssue<unknown>> | undefined> {
    return {
        kind: 'transformation',
        type: 'to_plain_date',
        reference: toPlainDate,
        async: false,
        message,
        '~run'(dataset, config) {
            try {
                if (dataset.value instanceof ZonedDateTime) {
                    dataset.value = Temporal.ZonedDateTime.from(dataset.value.toString()).toPlainDate();
                } else if (dataset.value instanceof CalendarDateTime) {
                    dataset.value = Temporal.PlainDateTime.from(dataset.value.toString()).toPlainDate();
                } else if (dataset.value instanceof CalendarDate) {
                    dataset.value = Temporal.PlainDate.from(dataset.value.toString());
                } else if (!(dataset.value instanceof Temporal.PlainDate)) {
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
