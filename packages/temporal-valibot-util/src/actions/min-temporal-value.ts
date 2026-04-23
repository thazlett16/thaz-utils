import * as v from 'valibot';

import type { TemporalValueInput } from './types';

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
      if (dataset.typed && !(dataset.value >= this.requirement)) {
        v._addIssue(this, 'value', dataset, config, {
          received: dataset.value.toJSON(),
        });
      }

      return dataset;
    },
  };
}
