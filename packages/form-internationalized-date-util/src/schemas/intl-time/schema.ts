import { Time } from '@internationalized/date';
import * as v from 'valibot';

export interface InternationalizedTimeIssue extends v.BaseIssue<unknown> {
  kind: 'schema';
  type: 'time';
  expected: 'Internationalized.Time';
}

export interface InternationalizedTimeSchema<
  TMessage extends v.ErrorMessage<InternationalizedTimeIssue> | undefined,
> extends v.BaseSchema<Time, Time, InternationalizedTimeIssue> {
  type: 'time';
  reference: typeof internationalizedTime;
  expects: 'Internationalized.Time';
  message: TMessage;
}

/**
 * Creates an @internationalized/date Time schema.
 *
 * @returns @internationalized/date Time schema.
 */
export function internationalizedTime(): InternationalizedTimeSchema<undefined>;

/**
 * Creates an @internationalized/date Time schema.
 *
 * @param message The error message.
 *
 * @returns @internationalized/date Time schema.
 */
export function internationalizedTime<const TMessage extends v.ErrorMessage<InternationalizedTimeIssue>>(
  message: TMessage,
): InternationalizedTimeSchema<TMessage>;

export function internationalizedTime(
  message?: v.ErrorMessage<InternationalizedTimeIssue>,
): InternationalizedTimeSchema<v.ErrorMessage<InternationalizedTimeIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'time',
    reference: internationalizedTime,
    expects: 'Internationalized.Time',
    async: false,
    message,
    get '~standard'() {
      return v._getStandardProps(this);
    },
    '~run'(dataset, config) {
      if (dataset.value instanceof Time) {
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = true;
      } else {
        v._addIssue(this, 'type', dataset, config);
      }

      // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return dataset as v.OutputDataset<Dayjs, InternationalizedTimeIssue>;
    },
  };
}
