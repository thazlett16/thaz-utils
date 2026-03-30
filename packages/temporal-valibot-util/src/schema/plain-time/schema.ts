import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

export interface PlainTimeIssue extends v.BaseIssue<unknown> {
  kind: 'schema';
  type: 'plain_time';
  expected: 'Temporal.PlainTime';
}

export interface PlainTimeSchema<TMessage extends v.ErrorMessage<PlainTimeIssue> | undefined> extends v.BaseSchema<
  Temporal.PlainTime,
  Temporal.PlainTime,
  PlainTimeIssue
> {
  type: 'plain_time';
  reference: typeof plainTime;
  expects: 'Temporal.PlainTime';
  message: TMessage;
}

/**
 * Creates a Temporal.PlainTime schema.
 *
 * @returns Temporal.PlainTime schema.
 */
export function plainTime(): PlainTimeSchema<undefined>;

/**
 * Creates a Temporal.PlainTime schema.
 *
 * @param message The error message.
 *
 * @returns Temporal.PlainTime schema.
 */
export function plainTime<const TMessage extends v.ErrorMessage<PlainTimeIssue>>(
  message: TMessage,
): PlainTimeSchema<TMessage>;

export function plainTime(
  message?: v.ErrorMessage<PlainTimeIssue>,
): PlainTimeSchema<v.ErrorMessage<PlainTimeIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'plain_time',
    reference: plainTime,
    expects: 'Temporal.PlainTime',
    async: false,
    message,
    get '~standard'() {
      return v._getStandardProps(this);
    },
    '~run'(dataset, config) {
      if (dataset.value instanceof Temporal.PlainTime) {
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = true;
      } else {
        v._addIssue(this, 'type', dataset, config);
      }

      // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return dataset as v.OutputDataset<Temporal.PlainTime, PlainTimeIssue>;
    },
  };
}
