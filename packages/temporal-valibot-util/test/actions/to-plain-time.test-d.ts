import type { Temporal } from '@js-temporal/polyfill';
import type { InferInput, InferIssue, InferOutput } from 'valibot';

import { describe, expectTypeOf, it } from 'vitest';

import type { ToPlainTimeAction, ToPlainTimeIssue } from '#src/actions/to-plain-time-value';

import { toPlainTime } from '#src/actions/to-plain-time-value';

describe('toPlainTime', () => {
  describe('should return action object', () => {
    it('with undefined message', () => {
      expectTypeOf(toPlainTime<string>()).toEqualTypeOf<ToPlainTimeAction<string, undefined>>();
    });

    it('with string message', () => {
      expectTypeOf(toPlainTime<string, 'message'>('message')).toEqualTypeOf<ToPlainTimeAction<string, 'message'>>();
    });

    it('with function message', () => {
      expectTypeOf(toPlainTime<string, () => string>(() => 'message')).toEqualTypeOf<
        ToPlainTimeAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = ToPlainTimeAction<string, undefined>;

    it('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    it('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Temporal.PlainTime>();
    });

    it('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<ToPlainTimeIssue<string>>();
    });
  });
});
