import type { Dayjs } from 'dayjs';

import { Temporal } from '@js-temporal/polyfill';
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
 * @returns A DayJS value.
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
      const { value } = dataset;

      try {
        if (typeof value === 'string') {
          dataset.value = dayJS(value);
        } else if (value instanceof Date) {
          dataset.value = dayJS(value);
        } else if (value instanceof Temporal.ZonedDateTime) {
          dataset.value = dayJS.utc(value.toInstant().toString()).tz(value.timeZoneId);
        } else if (value instanceof Temporal.Instant) {
          dataset.value = dayJS.utc(value.toString());
        } else if (value instanceof Temporal.PlainDateTime) {
          dataset.value = dayJS({
            years: value.year,
            months: value.month - 1,
            dates: value.day,
            hours: value.hour,
            minutes: value.minute,
            seconds: value.second,
            milliseconds: value.millisecond,
          });
        } else if (value instanceof Temporal.PlainDate) {
          dataset.value = dayJS({
            years: value.year,
            months: value.month - 1,
            dates: value.day,
          });
        } else if (value instanceof Temporal.PlainTime) {
          dataset.value = dayJS({
            hours: value.hour,
            minutes: value.minute,
            seconds: value.second,
            milliseconds: value.millisecond,
          });
        } else if (!dayJS.isDayjs(value)) {
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
