import { CalendarDate } from '@internationalized/date';
import * as v from 'valibot';

export interface InternationalizedCalendarDateIssue extends v.BaseIssue<unknown> {
    kind: 'schema';
    type: 'calendarDate';
    expected: 'Internationalized.CalendarDate';
}

export interface InternationalizedCalendarDateSchema<
    TMessage extends v.ErrorMessage<InternationalizedCalendarDateIssue> | undefined,
> extends v.BaseSchema<CalendarDate, CalendarDate, InternationalizedCalendarDateIssue> {
    type: 'calendarDate';
    reference: typeof internationalizedCalendarDate;
    expects: 'Internationalized.CalendarDate';
    message: TMessage;
}

/**
 * Creates an @internationalized/date CalendarDate schema.
 *
 * @returns An @internationalized/date CalendarDate schema.
 */
export function internationalizedCalendarDate(): InternationalizedCalendarDateSchema<undefined>;

/**
 * Creates an @internationalized/date CalendarDate schema.
 *
 * @param message The error message.
 *
 * @returns @internationalized/date CalendarDate schema.
 */
export function internationalizedCalendarDate<
    const TMessage extends v.ErrorMessage<InternationalizedCalendarDateIssue>,
>(message: TMessage): InternationalizedCalendarDateSchema<TMessage>;

export function internationalizedCalendarDate(
    message?: v.ErrorMessage<InternationalizedCalendarDateIssue>,
): InternationalizedCalendarDateSchema<v.ErrorMessage<InternationalizedCalendarDateIssue> | undefined> {
    return {
        kind: 'schema',
        type: 'calendarDate',
        reference: internationalizedCalendarDate,
        expects: 'Internationalized.CalendarDate',
        async: false,
        message,
        get '~standard'() {
            return v._getStandardProps(this);
        },
        '~run'(dataset, config) {
            if (dataset.value instanceof CalendarDate) {
                // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
                dataset.typed = true;
            } else {
                v._addIssue(this, 'type', dataset, config);
            }
            // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
            // oxlint-disable-next-line typescript/no-unsafe-type-assertion
            return dataset as v.OutputDataset<Dayjs, CalendarDateIssue>;
        },
    };
}
