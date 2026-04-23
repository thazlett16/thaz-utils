import type { Temporal } from '@js-temporal/polyfill';
import type { InferInput, InferIssue, InferOutput } from 'valibot';

import { describe, expectTypeOf, it } from 'vitest';

import type { ToZonedDateTimeAction, ToZonedDateTimeIssue } from '#src/actions/to-zoned-date-time-value';

import { toZonedDateTime } from '#src/actions/to-zoned-date-time-value';

describe('toZonedDateTime', () => {
  describe('should return action object', () => {
    it('with undefined message', () => {
      expectTypeOf(toZonedDateTime<string>()).toEqualTypeOf<ToZonedDateTimeAction<string, undefined>>();
    });

    it('with string message', () => {
      expectTypeOf(toZonedDateTime<string, 'message'>('message')).toEqualTypeOf<
        ToZonedDateTimeAction<string, 'message'>
      >();
    });

    it('with function message', () => {
      expectTypeOf(toZonedDateTime<string, () => string>(() => 'message')).toEqualTypeOf<
        ToZonedDateTimeAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = ToZonedDateTimeAction<string, undefined>;

    it('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    it('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Temporal.ZonedDateTime>();
    });

    it('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<ToZonedDateTimeIssue<string>>();
    });
  });
});
