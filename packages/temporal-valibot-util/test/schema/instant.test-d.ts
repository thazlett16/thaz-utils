import type { Temporal } from '@js-temporal/polyfill';
import type { InferInput, InferIssue, InferOutput } from 'valibot';

import { describe, expectTypeOf, it } from 'vitest';

import type { InstantIssue, InstantSchema } from '#src/schema/instant';

import { instant } from '#src/schema/instant';

describe('instant', () => {
  describe('should return schema object', () => {
    it('with undefined message', () => {
      type Schema = InstantSchema<undefined>;
      expectTypeOf(instant()).toEqualTypeOf<Schema>();
      expectTypeOf(instant(undefined)).toEqualTypeOf<Schema>();
    });

    it('with string message', () => {
      expectTypeOf(instant('message')).toEqualTypeOf<InstantSchema<'message'>>();
    });

    it('with function message', () => {
      expectTypeOf(instant(() => 'message')).toEqualTypeOf<InstantSchema<() => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Schema = InstantSchema<undefined>;

    it('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<Temporal.Instant>();
    });

    it('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<Temporal.Instant>();
    });

    it('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<InstantIssue>();
    });
  });
});
