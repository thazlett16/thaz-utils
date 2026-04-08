import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

export interface ToDurationIssue<TInput> extends v.BaseIssue<TInput | Temporal.Duration> {
    kind: 'transformation';
    type: 'to_duration';
    expected: null;
}

export interface ToDurationAction<
    TInput,
    TMessage extends v.ErrorMessage<ToDurationIssue<TInput>> | undefined,
> extends v.BaseTransformation<TInput, Temporal.Duration, ToDurationIssue<TInput>> {
    type: 'to_duration';
    reference: typeof toDuration;
    message: TMessage;
}

export interface ToDurationOptions {
    durationType:
        | 'years'
        | 'months'
        | 'days'
        | 'hours'
        | 'minutes'
        | 'seconds'
        | 'milliseconds'
        | 'microseconds'
        | 'nanoseconds';
}

/**
 * Convert value to a Temporal.Duration.
 *
 * @param options Options to convert values to a Duration
 *
 * @returns A Temporal.Duration value.
 */
export function toDuration<TInput>(options: ToDurationOptions): ToDurationAction<TInput, undefined>;

/**
 * Convert value to a Temporal.Duration.
 *
 * @param options Options to convert values to a Duration
 * @param message The error message.
 *
 * @returns A max value action.
 */
export function toDuration<TInput, const TMessage extends v.ErrorMessage<ToDurationIssue<TInput>> | undefined>(
    options: ToDurationOptions,
    message: TMessage,
): ToDurationAction<TInput, TMessage>;

export function toDuration(
    options: ToDurationOptions,
    message?: v.ErrorMessage<ToDurationIssue<unknown>>,
): ToDurationAction<unknown, v.ErrorMessage<ToDurationIssue<unknown>> | undefined> {
    const { durationType } = options;

    return {
        kind: 'transformation',
        type: 'to_duration',
        reference: toDuration,
        async: false,
        message,
        '~run'(dataset, config) {
            try {
                if (typeof dataset.value === 'number') {
                    dataset.value = Temporal.Duration.from({
                        [durationType]: dataset.value,
                    });
                } else if (!(dataset.value instanceof Temporal.Duration)) {
                    v._addIssue(this, 'duration', dataset, config, {
                        received: '"Invalid conversion option"',
                    });
                    // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
                    dataset.typed = false;
                }
            } catch {
                v._addIssue(this, 'duration', dataset, config);
                // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
                dataset.typed = false;
            }

            // oxlint-disable-next-line typescript/no-unsafe-type-assertion
            return dataset as v.OutputDataset<Temporal.Duration, ToDurationIssue<unknown>>;
        },
    };
}
