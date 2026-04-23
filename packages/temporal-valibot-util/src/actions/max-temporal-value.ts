import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

import type { TemporalValueInput } from './types';

/**
 * Issue raised when a Temporal value exceeds the allowed maximum.
 */
export interface TemporalMaxValueIssue<
  TInput extends TemporalValueInput,
  TRequirement extends TemporalValueInput,
  // WATCH: https://github.com/oxc-project/oxc/issues/13258
  // oxlint-disable-next-line import/namespace
> extends v.BaseIssue<TInput> {
  kind: 'validation';
  type: 'temporal_max_value';
  expected: `<=${string}`;
  requirement: TRequirement;
}

/**
 * Validation action that enforces an upper bound on a Temporal value.
 *
 * Comparison uses the appropriate `Temporal.X.compare()` static method dispatched
 * by runtime type. `Duration.compare` requires neither duration to have non-zero
 * years, months, or weeks (no `relativeTo` is provided).
 */
export interface TemporalMaxValueAction<
  TInput extends TemporalValueInput,
  TRequirement extends TemporalValueInput,
  TMessage extends v.ErrorMessage<TemporalMaxValueIssue<TInput, TRequirement>> | undefined,
  // WATCH: https://github.com/oxc-project/oxc/issues/13258
  // oxlint-disable-next-line import/namespace
> extends v.BaseValidation<TInput, TInput, TemporalMaxValueIssue<TInput, TRequirement>> {
  type: 'temporal_max_value';
  reference: typeof temporalMaxValue;
  expects: `<=${string}`;
  requirement: TRequirement;
  message: TMessage;
}

/**
 * Creates a temporal max value validation action.
 *
 * @param requirement The maximum value.
 *
 * @returns A max value action.
 */
export function temporalMaxValue<TInput extends TemporalValueInput, const TRequirement extends TInput>(
  requirement: TRequirement,
): TemporalMaxValueAction<TInput, TRequirement, undefined>;

/**
 * Creates a temporal max value validation action.
 *
 * @param requirement The maximum value.
 * @param message The error message.
 *
 * @returns A max value action.
 */
export function temporalMaxValue<
  TInput extends TemporalValueInput,
  const TRequirement extends TInput,
  const TMessage extends v.ErrorMessage<TemporalMaxValueIssue<TInput, TRequirement>>,
>(requirement: TRequirement, message: TMessage): TemporalMaxValueAction<TInput, TRequirement, TMessage>;

export function temporalMaxValue(
  requirement: TemporalValueInput,
  message?: v.ErrorMessage<TemporalMaxValueIssue<TemporalValueInput, TemporalValueInput>>,
): TemporalMaxValueAction<
  TemporalValueInput,
  TemporalValueInput,
  v.ErrorMessage<TemporalMaxValueIssue<TemporalValueInput, TemporalValueInput>> | undefined
> {
  return {
    kind: 'validation',
    type: 'temporal_max_value',
    reference: temporalMaxValue,
    async: false,
    expects: `<=${requirement.toJSON()}`,
    requirement,
    message,
    '~run'(dataset, config) {
      if (dataset.typed) {
        const { value } = dataset;
        const req = this.requirement;

        if (value instanceof Temporal.Duration) {
          if (req instanceof Temporal.Duration && Temporal.Duration.compare(value, req) > 0) {
            v._addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (value instanceof Temporal.Instant) {
          if (req instanceof Temporal.Instant && Temporal.Instant.compare(value, req) > 0) {
            v._addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (value instanceof Temporal.PlainDateTime) {
          if (req instanceof Temporal.PlainDateTime && Temporal.PlainDateTime.compare(value, req) > 0) {
            v._addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (value instanceof Temporal.PlainDate) {
          if (req instanceof Temporal.PlainDate && Temporal.PlainDate.compare(value, req) > 0) {
            v._addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (value instanceof Temporal.PlainTime) {
          if (req instanceof Temporal.PlainTime && Temporal.PlainTime.compare(value, req) > 0) {
            v._addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else {
          if (req instanceof Temporal.ZonedDateTime && Temporal.ZonedDateTime.compare(value, req) > 0) {
            v._addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        }
      }

      return dataset;
    },
  };
}
