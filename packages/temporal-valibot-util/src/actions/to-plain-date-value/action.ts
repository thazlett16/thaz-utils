import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

export interface ToPlainDateIssue<TInput> extends v.BaseIssue<TInput | Temporal.PlainDate> {
    kind: 'transformation';
    type: 'to_plain_date';
    expected: null;
}

export interface ToPlainDateAction<
    TInput,
    TMessage extends v.ErrorMessage<ToPlainDateIssue<TInput>> | undefined,
> extends v.BaseTransformation<TInput, Temporal.PlainDate, ToPlainDateIssue<TInput>> {
    type: 'to_plain_date';
    reference: typeof toPlainDate;
    message: TMessage;
}

/**
 * Convert value to a Temporal.PlainDate.
 *
 * @returns A Temporal.PlainDate value.
 */
export function toPlainDate<TInput>(): ToPlainDateAction<TInput, undefined>;

/**
 * Convert value to a Temporal.PlainDate.
 *
 * @param message The error message.
 *
 * @returns A max value action.
 */
export function toPlainDate<TInput, const TMessage extends v.ErrorMessage<ToPlainDateIssue<TInput>> | undefined>(
    message: TMessage,
): ToPlainDateAction<TInput, TMessage>;

export function toPlainDate(
    message?: v.ErrorMessage<ToPlainDateIssue<unknown>>,
): ToPlainDateAction<unknown, v.ErrorMessage<ToPlainDateIssue<unknown>> | undefined> {
    return {
        kind: 'transformation',
        type: 'to_plain_date',
        reference: toPlainDate,
        async: false,
        message,
        '~run'(dataset, config) {
            try {
                if (typeof dataset.value === 'string') {
                    const { value } = dataset;

                    try {
                        dataset.value = Temporal.ZonedDateTime.from(value).toPlainDate();
                    } catch {
                        try {
                            dataset.value = Temporal.PlainDateTime.from(value).toPlainDate();
                        } catch {
                            try {
                                dataset.value = Temporal.PlainDate.from(value);
                            } catch {
                                v._addIssue(this, 'plainDate', dataset, config);
                                // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
                                dataset.typed = false;
                            }
                        }
                    }
                } else if (dataset.value instanceof Temporal.ZonedDateTime) {
                    dataset.value = dataset.value.toPlainDate();
                } else if (dataset.value instanceof Temporal.PlainDateTime) {
                    dataset.value = dataset.value.toPlainDate();
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
