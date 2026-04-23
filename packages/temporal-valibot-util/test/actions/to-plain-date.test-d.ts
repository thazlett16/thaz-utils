import type { Temporal } from '@js-temporal/polyfill';
import type { InferInput, InferIssue, InferOutput } from 'valibot';

import { describe, expectTypeOf, it } from 'vitest';

import type { ToPlainDateAction, ToPlainDateIssue } from '#src/actions/to-plain-date-value';

import { toPlainDate } from '#src/actions/to-plain-date-value';

describe('toPlainDate', () => {
  describe('should return action object', () => {
    it('with undefined message', () => {
      expectTypeOf(toPlainDate<string>()).toEqualTypeOf<ToPlainDateAction<string, undefined>>();
    });

    it('with string message', () => {
      expectTypeOf(toPlainDate<string, 'message'>('message')).toEqualTypeOf<ToPlainDateAction<string, 'message'>>();
    });

    it('with function message', () => {
      expectTypeOf(toPlainDate<string, () => string>(() => 'message')).toEqualTypeOf<
        ToPlainDateAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = ToPlainDateAction<string, undefined>;

    it('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    it('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Temporal.PlainDate>();
    });

    it('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<ToPlainDateIssue<string>>();
    });
  });
});
