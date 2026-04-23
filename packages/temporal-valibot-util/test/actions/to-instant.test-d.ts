import type { Temporal } from '@js-temporal/polyfill';
import type { InferInput, InferIssue, InferOutput } from 'valibot';

import { describe, expectTypeOf, it } from 'vitest';

import type { ToInstantAction, ToInstantIssue } from '#src/actions/to-instant-value';

import { toInstant } from '#src/actions/to-instant-value';

describe('toInstant', () => {
  describe('should return action object', () => {
    it('with undefined message', () => {
      expectTypeOf(toInstant<string>()).toEqualTypeOf<ToInstantAction<string, undefined>>();
    });

    it('with string message', () => {
      expectTypeOf(toInstant<string, 'message'>('message')).toEqualTypeOf<ToInstantAction<string, 'message'>>();
    });

    it('with function message', () => {
      expectTypeOf(toInstant<string, () => string>(() => 'message')).toEqualTypeOf<
        ToInstantAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = ToInstantAction<string, undefined>;

    it('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    it('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Temporal.Instant>();
    });

    it('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<ToInstantIssue<string>>();
    });
  });
});
