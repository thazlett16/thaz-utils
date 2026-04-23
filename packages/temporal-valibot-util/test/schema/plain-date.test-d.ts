import type { Temporal } from '@js-temporal/polyfill';
import type { InferInput, InferIssue, InferOutput } from 'valibot';

import { describe, expectTypeOf, it } from 'vitest';

import type { PlainDateIssue, PlainDateSchema } from '#src/schema/plain-date';

import { plainDate } from '#src/schema/plain-date';

describe('plainDate', () => {
  describe('should return schema object', () => {
    it('with undefined message', () => {
      type Schema = PlainDateSchema<undefined>;
      expectTypeOf(plainDate()).toEqualTypeOf<Schema>();
      expectTypeOf(plainDate(undefined)).toEqualTypeOf<Schema>();
    });

    it('with string message', () => {
      expectTypeOf(plainDate('message')).toEqualTypeOf<PlainDateSchema<'message'>>();
    });

    it('with function message', () => {
      expectTypeOf(plainDate(() => 'message')).toEqualTypeOf<PlainDateSchema<() => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Schema = PlainDateSchema<undefined>;

    it('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<Temporal.PlainDate>();
    });

    it('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<Temporal.PlainDate>();
    });

    it('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<PlainDateIssue>();
    });
  });
});
