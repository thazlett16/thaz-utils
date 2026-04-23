import type { Temporal } from '@js-temporal/polyfill';
import type { InferInput, InferIssue, InferOutput } from 'valibot';

import { describe, expectTypeOf, it } from 'vitest';

import type { ToPlainDateTimeAction, ToPlainDateTimeIssue } from '#src/actions/to-plain-date-time-value';

import { toPlainDateTime } from '#src/actions/to-plain-date-time-value';

describe('toPlainDateTime', () => {
  describe('should return action object', () => {
    it('with undefined message', () => {
      expectTypeOf(toPlainDateTime<string>()).toEqualTypeOf<ToPlainDateTimeAction<string, undefined>>();
    });

    it('with string message', () => {
      expectTypeOf(toPlainDateTime<string, 'message'>('message')).toEqualTypeOf<
        ToPlainDateTimeAction<string, 'message'>
      >();
    });

    it('with function message', () => {
      expectTypeOf(toPlainDateTime<string, () => string>(() => 'message')).toEqualTypeOf<
        ToPlainDateTimeAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = ToPlainDateTimeAction<string, undefined>;

    it('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    it('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Temporal.PlainDateTime>();
    });

    it('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<ToPlainDateTimeIssue<string>>();
    });
  });
});
