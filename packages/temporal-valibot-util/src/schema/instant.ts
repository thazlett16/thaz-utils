import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

export interface InstantIssue extends v.BaseIssue<unknown> {
  kind: 'schema';
  type: 'instant';
  expected: 'Temporal.Instant';
}

export interface InstantSchema<TMessage extends v.ErrorMessage<InstantIssue> | undefined> extends v.BaseSchema<
  Temporal.Instant,
  Temporal.Instant,
  InstantIssue
> {
  type: 'instant';
  reference: typeof instant;
  expects: 'Temporal.Instant';
  message: TMessage;
}

/**
 * Creates a Temporal.Instant schema.
 *
 * @returns Temporal.Instant schema.
 */
export function instant(): InstantSchema<undefined>;

/**
 * Creates a Temporal.Instant schema.
 *
 * @param message The error message.
 *
 * @returns Temporal.Instant schema.
 */
export function instant<const TMessage extends v.ErrorMessage<InstantIssue>>(
  message: TMessage,
): InstantSchema<TMessage>;

export function instant(
  message?: v.ErrorMessage<InstantIssue>,
): InstantSchema<v.ErrorMessage<InstantIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'instant',
    reference: instant,
    expects: 'Temporal.Instant',
    async: false,
    message,
    get '~standard'() {
      return v._getStandardProps(this);
    },
    '~run'(dataset, config) {
      if (dataset.value instanceof Temporal.Instant) {
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = true;
      } else {
        v._addIssue(this, 'type', dataset, config);
      }

      // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return dataset as v.OutputDataset<Temporal.Instant, InstantIssue>;
    },
  };
}
