import type { Dayjs } from 'dayjs';

import * as v from 'valibot';

import { dayJS } from '#src/dayjs.config';

export interface DayJSIssue extends v.BaseIssue<unknown> {
    kind: 'schema';
    type: 'dayjs';
    expected: 'dayjs';
}

export interface DayJSSchema<TMessage extends v.ErrorMessage<DayJSIssue> | undefined> extends v.BaseSchema<
    Dayjs,
    Dayjs,
    DayJSIssue
> {
    type: 'dayjs';
    reference: typeof dayjs;
    expects: 'dayjs';
    message: TMessage;
}

/**
 * Creates a DayJS schema.
 *
 * @returns A DayJS schema.
 */
export function dayjs(): DayJSSchema<undefined>;

/**
 * Creates a DayJS schema.
 *
 * @param message The error message.
 *
 * @returns A DayJS schema.
 */
export function dayjs<const TMessage extends v.ErrorMessage<DayJSIssue>>(message: TMessage): DayJSSchema<TMessage>;

export function dayjs(message?: v.ErrorMessage<DayJSIssue>): DayJSSchema<v.ErrorMessage<DayJSIssue> | undefined> {
    return {
        kind: 'schema',
        type: 'dayjs',
        reference: dayjs,
        expects: 'dayjs',
        async: false,
        message,
        get '~standard'() {
            return v._getStandardProps(this);
        },
        '~run'(dataset, config) {
            if (dayJS.isDayjs(dataset.value)) {
                // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
                dataset.typed = true;
            } else {
                v._addIssue(this, 'type', dataset, config);
            }
            // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
            // oxlint-disable-next-line typescript/no-unsafe-type-assertion
            return dataset as v.OutputDataset<Dayjs, DayJSIssue>;
        },
    };
}
