import { CalendarDateTime } from '@internationalized/date';
import * as v from 'valibot';

export interface InternationalizedCalendarDateTimeIssue extends v.BaseIssue<unknown> {
  kind: 'schema';
  type: 'calendarDateTime';
  expected: 'Internationalized.CalendarDateTime';
}

export interface InternationalizedCalendarDateTimeSchema<
  TMessage extends v.ErrorMessage<InternationalizedCalendarDateTimeIssue> | undefined,
> extends v.BaseSchema<CalendarDateTime, CalendarDateTime, InternationalizedCalendarDateTimeIssue> {
  type: 'calendarDateTime';
  reference: typeof internationalizedCalendarDateTime;
  expects: 'Internationalized.CalendarDateTime';
  message: TMessage;
}

/**
 * Creates an @internationalized/date CalendarDateTime schema.
 *
 * @returns @internationalized/date CalendarDateTime schema.
 */
export function internationalizedCalendarDateTime(): InternationalizedCalendarDateTimeSchema<undefined>;

/**
 * Creates an @internationalized/date CalendarDateTime schema.
 *
 * @param message The error message.
 *
 * @returns @internationalized/date CalendarDateTime schema.
 */
export function internationalizedCalendarDateTime<
  const TMessage extends v.ErrorMessage<InternationalizedCalendarDateTimeIssue>,
>(message: TMessage): InternationalizedCalendarDateTimeSchema<TMessage>;

export function internationalizedCalendarDateTime(
  message?: v.ErrorMessage<InternationalizedCalendarDateTimeIssue>,
): InternationalizedCalendarDateTimeSchema<v.ErrorMessage<InternationalizedCalendarDateTimeIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'calendarDateTime',
    reference: internationalizedCalendarDateTime,
    expects: 'Internationalized.CalendarDateTime',
    async: false,
    message,
    get '~standard'() {
      return v._getStandardProps(this);
    },
    '~run'(dataset, config) {
      if (dataset.value instanceof CalendarDateTime) {
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = true;
      } else {
        v._addIssue(this, 'type', dataset, config);
      }

      // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return dataset as v.OutputDataset<Dayjs, InternationalizedCalendarDateTimeIssue>;
    },
  };
}
