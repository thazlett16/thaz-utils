import type { Dayjs } from 'dayjs';

import { Temporal } from '@js-temporal/polyfill';
import {
    convertStringToDayJS,
    convertDateToDayJS,
    convertInstantToDayJS,
    convertPlainDateToDayJS,
    convertPlainTimeToDayJS,
    convertPlainDateTimeToDayJS,
} from '@thazstack/temporal-dayjs-util';
import * as v from 'valibot';

import { dayJS } from '#src/dayjs.config';

export interface ToDayJSIssue<TInput> extends v.BaseIssue<TInput | Dayjs> {
    kind: 'transformation';
    type: 'to_dayjs';
    expected: null;
}

export interface ToDayJSAction<
    TInput,
    TMessage extends v.ErrorMessage<ToDayJSIssue<TInput>> | undefined,
> extends v.BaseTransformation<TInput, Dayjs, ToDayJSIssue<TInput>> {
    type: 'to_dayjs';
    reference: typeof toDayJS;
    message: TMessage;
}

/**
 * Convert value to a DayJS.
 *
 * @returns A DayJS value.
 */
export function toDayJS<TInput>(): ToDayJSAction<TInput, undefined>;

/**
 * Convert value to a DayJS.
 *
 * @param message The error message.
 *
 * @returns A max value action.
 */
export function toDayJS<TInput, const TMessage extends v.ErrorMessage<ToDayJSIssue<TInput>> | undefined>(
    message: TMessage,
): ToDayJSAction<TInput, TMessage>;

export function toDayJS(
    message?: v.ErrorMessage<ToDayJSIssue<unknown>>,
): ToDayJSAction<unknown, v.ErrorMessage<ToDayJSIssue<unknown>> | undefined> {
    return {
        kind: 'transformation',
        type: 'to_dayjs',
        reference: toDayJS,
        async: false,
        message,
        '~run'(dataset, config) {
            try {
                if (typeof dataset.value === 'string') {
                    dataset.value = convertStringToDayJS(dataset.value);
                } else if (dataset.value instanceof Date) {
                    dataset.value = convertDateToDayJS(dataset.value);
                } else if (dataset.value instanceof Temporal.ZonedDateTime) {
                    dataset.value = convertInstantToDayJS(dataset.value.toInstant());
                } else if (dataset.value instanceof Temporal.Instant) {
                    dataset.value = convertInstantToDayJS(dataset.value);
                } else if (dataset.value instanceof Temporal.PlainDateTime) {
                    dataset.value = convertPlainDateTimeToDayJS(dataset.value);
                } else if (dataset.value instanceof Temporal.PlainDate) {
                    dataset.value = convertPlainDateToDayJS(dataset.value);
                } else if (dataset.value instanceof Temporal.PlainTime) {
                    dataset.value = convertPlainTimeToDayJS(dataset.value);
                } else if (!dayJS.isDayjs(dataset.value)) {
                    v._addIssue(this, 'dayjs', dataset, config, {
                        received: '"Invalid conversion option"',
                    });
                    // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
                    dataset.typed = false;
                }
            } catch {
                v._addIssue(this, 'dayjs', dataset, config);
                // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
                dataset.typed = false;
            }

            // oxlint-disable-next-line typescript/no-unsafe-type-assertion
            return dataset as v.OutputDataset<Dayjs, ToDayJSIssue<unknown>>;
        },
    };
}
