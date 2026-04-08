import { ZonedDateTime } from '@internationalized/date';
import * as v from 'valibot';

export interface InternationalizedZonedDateTimeIssue extends v.BaseIssue<unknown> {
    kind: 'schema';
    type: 'zonedDateTime';
    expected: 'Internationalized.ZonedDateTime';
}

export interface InternationalizedZonedDateTimeSchema<
    TMessage extends v.ErrorMessage<InternationalizedZonedDateTimeIssue> | undefined,
> extends v.BaseSchema<ZonedDateTime, ZonedDateTime, InternationalizedZonedDateTimeIssue> {
    type: 'zonedDateTime';
    reference: typeof internationalizedZonedDateTime;
    expects: 'Internationalized.ZonedDateTime';
    message: TMessage;
}

/**
 * Creates an @internationalized/date ZonedDateTime schema.
 *
 * @returns @internationalized/date ZonedDateTime schema.
 */
export function internationalizedZonedDateTime(): InternationalizedZonedDateTimeSchema<undefined>;

/**
 * Creates an @internationalized/date ZonedDateTime schema.
 *
 * @param message The error message.
 *
 * @returns @internationalized/date ZonedDateTime schema.
 */
export function internationalizedZonedDateTime<
    const TMessage extends v.ErrorMessage<InternationalizedZonedDateTimeIssue>,
>(message: TMessage): InternationalizedZonedDateTimeSchema<TMessage>;

export function internationalizedZonedDateTime(
    message?: v.ErrorMessage<InternationalizedZonedDateTimeIssue>,
): InternationalizedZonedDateTimeSchema<v.ErrorMessage<InternationalizedZonedDateTimeIssue> | undefined> {
    return {
        kind: 'schema',
        type: 'zonedDateTime',
        reference: internationalizedZonedDateTime,
        expects: 'Internationalized.ZonedDateTime',
        async: false,
        message,
        get '~standard'() {
            return v._getStandardProps(this);
        },
        '~run'(dataset, config) {
            if (dataset.value instanceof ZonedDateTime) {
                // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
                dataset.typed = true;
            } else {
                v._addIssue(this, 'type', dataset, config);
            }
            // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
            // oxlint-disable-next-line typescript/no-unsafe-type-assertion
            return dataset as v.OutputDataset<Dayjs, InternationalizedZonedDateTimeIssue>;
        },
    };
}
