import type { ToInstantIssue, ToInstantAction } from '@thazstack/temporal-valibot-util';

import { Temporal } from '@js-temporal/polyfill';
import { convertDayJSToInstant } from '@thazstack/temporal-dayjs-util';
import * as v from 'valibot';

import { dayJS } from '#src/dayjs.config';

export interface ToInstantDayJSAction<
    TInput,
    TMessage extends v.ErrorMessage<ToInstantIssue<TInput>> | undefined,
> extends ToInstantAction<TInput, TMessage> {
    reference: typeof toInstant;
}

/**
 * Convert value to a Temporal.Instant.
 *
 * @returns A Temporal.Instant value.
 */
export function toInstant<TInput>(): ToInstantDayJSAction<TInput, undefined>;

/**
 * Convert value to a Temporal.Instant.
 *
 * @param message The error message.
 *
 * @returns A max value action.
 */
export function toInstant<TInput, const TMessage extends v.ErrorMessage<ToInstantIssue<TInput>> | undefined>(
    message: TMessage,
): ToInstantDayJSAction<TInput, TMessage>;

export function toInstant(
    message?: v.ErrorMessage<ToInstantIssue<unknown>>,
): ToInstantDayJSAction<unknown, v.ErrorMessage<ToInstantIssue<unknown>> | undefined> {
    return {
        kind: 'transformation',
        type: 'to_instant',
        reference: toInstant,
        async: false,
        message,
        '~run'(dataset, config) {
            try {
                if (dayJS.isDayjs(dataset.value)) {
                    dataset.value = convertDayJSToInstant(dataset.value);
                } else if (!(dataset.value instanceof Temporal.Instant)) {
                    v._addIssue(this, 'instant', dataset, config, {
                        received: '"Invalid conversion option"',
                    });
                    // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
                    dataset.typed = false;
                }
            } catch {
                v._addIssue(this, 'instant', dataset, config);
                // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
                dataset.typed = false;
            }

            // oxlint-disable-next-line typescript/no-unsafe-type-assertion
            return dataset as v.OutputDataset<Temporal.Instant, ToInstantIssue<unknown>>;
        },
    };
}
