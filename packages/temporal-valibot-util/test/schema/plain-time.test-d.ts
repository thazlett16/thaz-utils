import type { Temporal } from '@js-temporal/polyfill';
import type { InferInput, InferIssue, InferOutput } from 'valibot';

import { describe, expectTypeOf, it } from 'vitest';

import type { PlainTimeIssue, PlainTimeSchema } from '#src/schema/plain-time';

import { plainTime } from '#src/schema/plain-time';

describe('plainTime', () => {
  describe('should return schema object', () => {
    it('with undefined message', () => {
      type Schema = PlainTimeSchema<undefined>;
      expectTypeOf(plainTime()).toEqualTypeOf<Schema>();
      expectTypeOf(plainTime(undefined)).toEqualTypeOf<Schema>();
    });

    it('with string message', () => {
      expectTypeOf(plainTime('message')).toEqualTypeOf<PlainTimeSchema<'message'>>();
    });

    it('with function message', () => {
      expectTypeOf(plainTime(() => 'message')).toEqualTypeOf<PlainTimeSchema<() => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Schema = PlainTimeSchema<undefined>;

    it('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<Temporal.PlainTime>();
    });

    it('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<Temporal.PlainTime>();
    });

    it('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<PlainTimeIssue>();
    });
  });
});
