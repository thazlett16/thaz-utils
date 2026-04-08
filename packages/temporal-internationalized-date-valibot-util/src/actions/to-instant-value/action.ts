import type { ToInstantIssue, ToInstantAction } from '@thazstack/temporal-valibot-util';

import { ZonedDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

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
                if (dataset.value instanceof ZonedDateTime) {
                    dataset.value = Temporal.ZonedDateTime.from(dataset.value.toString()).toInstant();
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
