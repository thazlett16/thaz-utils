import type { Dayjs } from 'dayjs';

import * as v from 'valibot';

export interface IsDayJSValidIssue<TInput extends Dayjs> extends v.BaseIssue<TInput | Dayjs> {
  kind: 'validation';
  type: 'is_dayjs_valid';
  expected: null;
}

export interface IsDayJSValidAction<
  TInput extends Dayjs,
  TMessage extends v.ErrorMessage<IsDayJSValidIssue<TInput>> | undefined,
> extends v.BaseValidation<TInput, TInput, IsDayJSValidIssue<TInput>> {
  type: 'is_dayjs_valid';
  reference: typeof isDayJSValid;
  expects: null;
  message: TMessage;
}

/**
 * Checks if Dayjs value is valid
 *
 * @returns Dayjs is valid check action.
 */
export function isDayJSValid<TInput extends Dayjs>(): IsDayJSValidAction<TInput, undefined>;

/**
 * Checks if Dayjs value is valid
 *
 * @param message The error message.
 *
 * @returns Dayjs is valid check action.
 */
export function isDayJSValid<TInput extends Dayjs, const TMessage extends v.ErrorMessage<IsDayJSValidIssue<TInput>>>(
  message: TMessage,
): IsDayJSValidAction<TInput, TMessage>;

export function isDayJSValid(
  message?: v.ErrorMessage<IsDayJSValidIssue<Dayjs>>,
): IsDayJSValidAction<Dayjs, v.ErrorMessage<IsDayJSValidIssue<Dayjs>> | undefined> {
  return {
    kind: 'validation',
    type: 'is_dayjs_valid',
    reference: isDayJSValid,
    expects: null,
    async: false,
    message,
    '~run'(dataset, config) {
      if (dataset.typed && !dataset.value.isValid()) {
        v._addIssue(this, 'dayjs', dataset, config, {
          received: '"Invalid Date"',
        });
      }
      return dataset;
    },
  };
}
