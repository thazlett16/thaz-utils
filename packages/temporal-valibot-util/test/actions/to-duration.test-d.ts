import type { Temporal } from '@js-temporal/polyfill';
import type { InferInput, InferIssue, InferOutput } from 'valibot';

import { describe, expectTypeOf, it } from 'vitest';

import type { ToDurationAction, ToDurationIssue } from '#src/actions/to-duration-value';

import { toDuration } from '#src/actions/to-duration-value';

describe('toDuration', () => {
  describe('should return action object', () => {
    it('with undefined message', () => {
      expectTypeOf(toDuration<number>({ durationType: 'hours' })).toEqualTypeOf<ToDurationAction<number, undefined>>();
    });

    it('with string message', () => {
      expectTypeOf(toDuration<number, 'message'>({ durationType: 'hours' }, 'message')).toEqualTypeOf<
        ToDurationAction<number, 'message'>
      >();
    });

    it('with function message', () => {
      expectTypeOf(toDuration<number, () => string>({ durationType: 'hours' }, () => 'message')).toEqualTypeOf<
        ToDurationAction<number, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = ToDurationAction<number, undefined>;

    it('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<number>();
    });

    it('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Temporal.Duration>();
    });

    it('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<ToDurationIssue<number>>();
    });
  });
});
