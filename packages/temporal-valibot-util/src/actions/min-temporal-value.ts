import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

import type { TemporalValueInput } from './types';

/**
 * Issue raised when a Temporal value falls below the required minimum.
 */
export interface TemporalMinValueIssue<
  TInput extends TemporalValueInput,
  TRequirement extends TemporalValueInput,
  // WATCH: https://github.com/oxc-project/oxc/issues/13258
  // oxlint-disable-next-line import/namespace
> extends v.BaseIssue<TInput> {
  kind: 'validation';
  type: 'temporal_min_value';
  expected: `>=${string}`;
  requirement: TRequirement;
}

/**
 * Validation action that enforces a lower bound on a Temporal value.
 *
 * Comparison uses the appropriate `Temporal.X.compare()` static method dispatched
 * by runtime type. `Duration.compare` requires neither duration to have non-zero
 * years, months, or weeks (no `relativeTo` is provided).
 */
export interface TemporalMinValueAction<
  TInput extends TemporalValueInput,
  TRequirement extends TemporalValueInput,
  TMessage extends v.ErrorMessage<TemporalMinValueIssue<TInput, TRequirement>> | undefined,
  // WATCH: https://github.com/oxc-project/oxc/issues/13258
  // oxlint-disable-next-line import/namespace
> extends v.BaseValidation<TInput, TInput, TemporalMinValueIssue<TInput, TRequirement>> {
  type: 'temporal_min_value';
  reference: typeof temporalMinValue;
  expects: `>=${string}`;
  requirement: TRequirement;
  message: TMessage;
}

/**
 * Creates a temporal min value validation action.
 *
 * @param requirement The minimum value.
 *
 * @returns A min value action.
 */
export function temporalMinValue<TInput extends TemporalValueInput, const TRequirement extends TInput>(
  requirement: TRequirement,
): TemporalMinValueAction<TInput, TRequirement, undefined>;

/**
 * Creates a temporal min value validation action.
 *
 * @param requirement The minimum value.
 * @param message The error message.
 *
 * @returns A min value action.
 */
export function temporalMinValue<
  TInput extends TemporalValueInput,
  const TRequirement extends TInput,
  const TMessage extends v.ErrorMessage<TemporalMinValueIssue<TInput, TRequirement>>,
>(requirement: TRequirement, message: TMessage): TemporalMinValueAction<TInput, TRequirement, TMessage>;

export function temporalMinValue(
  requirement: TemporalValueInput,
  message?: v.ErrorMessage<TemporalMinValueIssue<TemporalValueInput, TemporalValueInput>>,
): TemporalMinValueAction<
  TemporalValueInput,
  TemporalValueInput,
  v.ErrorMessage<TemporalMinValueIssue<TemporalValueInput, TemporalValueInput>> | undefined
> {
  return {
    kind: 'validation',
    type: 'temporal_min_value',
    reference: temporalMinValue,
    async: false,
    expects: `>=${requirement.toJSON()}`,
    requirement,
    message,
    '~run'(dataset, config) {
      if (dataset.typed) {
        const { value } = dataset;
        const req = this.requirement;

        if (value instanceof Temporal.Duration) {
          if (req instanceof Temporal.Duration && Temporal.Duration.compare(value, req) < 0) {
            v._addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (value instanceof Temporal.Instant) {
          if (req instanceof Temporal.Instant && Temporal.Instant.compare(value, req) < 0) {
            v._addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (value instanceof Temporal.PlainDateTime) {
          if (req instanceof Temporal.PlainDateTime && Temporal.PlainDateTime.compare(value, req) < 0) {
            v._addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (value instanceof Temporal.PlainDate) {
          if (req instanceof Temporal.PlainDate && Temporal.PlainDate.compare(value, req) < 0) {
            v._addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (value instanceof Temporal.PlainTime) {
          if (req instanceof Temporal.PlainTime && Temporal.PlainTime.compare(value, req) < 0) {
            v._addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else {
          if (req instanceof Temporal.ZonedDateTime && Temporal.ZonedDateTime.compare(value, req) < 0) {
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
