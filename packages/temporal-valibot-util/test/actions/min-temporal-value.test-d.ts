import type { InferInput, InferIssue, InferOutput } from 'valibot';

import { Temporal } from '@js-temporal/polyfill';
import { describe, expectTypeOf, it } from 'vitest';

import type { TemporalMinValueAction, TemporalMinValueIssue } from '#src/actions/min-temporal-value';
import type { TemporalValueInput } from '#src/actions/types';

import { temporalMinValue } from '#src/actions/min-temporal-value';

describe('temporalMinValue', () => {
  describe('should return action object', () => {
    const requirement = Temporal.PlainDate.from('2024-01-01');

    it('with undefined message', () => {
      type Action = TemporalMinValueAction<TemporalValueInput, Temporal.PlainDate, undefined>;
      expectTypeOf(temporalMinValue(requirement)).toEqualTypeOf<Action>();
    });

    it('with string message', () => {
      expectTypeOf(temporalMinValue(requirement, 'message')).toEqualTypeOf<
        TemporalMinValueAction<TemporalValueInput, Temporal.PlainDate, 'message'>
      >();
    });

    it('with function message', () => {
      expectTypeOf(temporalMinValue(requirement, () => 'message')).toEqualTypeOf<
        TemporalMinValueAction<TemporalValueInput, Temporal.PlainDate, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = TemporalMinValueAction<TemporalValueInput, Temporal.PlainDate, undefined>;

    it('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<TemporalValueInput>();
    });

    it('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<TemporalValueInput>();
    });

    it('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<TemporalMinValueIssue<TemporalValueInput, Temporal.PlainDate>>();
    });
  });
});
