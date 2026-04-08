import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

export interface ZonedDateTimeIssue extends v.BaseIssue<unknown> {
    kind: 'schema';
    type: 'zonedDateTime';
    expected: 'Temporal.ZonedDateTime';
}

export interface ZonedDateTimeSchema<
    TMessage extends v.ErrorMessage<ZonedDateTimeIssue> | undefined,
> extends v.BaseSchema<Temporal.ZonedDateTime, Temporal.ZonedDateTime, ZonedDateTimeIssue> {
    type: 'zonedDateTime';
    reference: typeof zonedDateTime;
    expects: 'Temporal.ZonedDateTime';
    message: TMessage;
}

/**
 * Creates a Temporal.ZonedDateTime schema.
 *
 * @returns A Temporal.ZonedDateTime schema.
 */
export function zonedDateTime(): ZonedDateTimeSchema<undefined>;

/**
 * Creates a Temporal.ZonedDateTime schema.
 *
 * @param message The error message.
 *
 * @returns A Temporal.ZonedDateTime schema.
 */
export function zonedDateTime<const TMessage extends v.ErrorMessage<ZonedDateTimeIssue>>(
    message: TMessage,
): ZonedDateTimeSchema<TMessage>;

export function zonedDateTime(
    message?: v.ErrorMessage<ZonedDateTimeIssue>,
): ZonedDateTimeSchema<v.ErrorMessage<ZonedDateTimeIssue> | undefined> {
    return {
        kind: 'schema',
        type: 'zonedDateTime',
        reference: zonedDateTime,
        expects: 'Temporal.ZonedDateTime',
        async: false,
        message,
        get '~standard'() {
            return v._getStandardProps(this);
        },
        '~run'(dataset, config) {
            if (dataset.value instanceof Temporal.ZonedDateTime) {
                // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
                dataset.typed = true;
            } else {
                v._addIssue(this, 'type', dataset, config);
            }
            // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
            // oxlint-disable-next-line typescript/no-unsafe-type-assertion
            return dataset as v.OutputDataset<Temporal.ZonedDateTime, ZonedDateTimeIssue>;
        },
    };
}
