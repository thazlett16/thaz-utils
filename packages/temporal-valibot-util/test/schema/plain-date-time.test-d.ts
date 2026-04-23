import type { Temporal } from '@js-temporal/polyfill';
import type { InferInput, InferIssue, InferOutput } from 'valibot';

import { describe, expectTypeOf, it } from 'vitest';

import type { PlainDateTimeIssue, PlainDateTimeSchema } from '#src/schema/plain-date-time';

import { plainDateTime } from '#src/schema/plain-date-time';

describe('plainDateTime', () => {
  describe('should return schema object', () => {
    it('with undefined message', () => {
      type Schema = PlainDateTimeSchema<undefined>;
      expectTypeOf(plainDateTime()).toEqualTypeOf<Schema>();
      expectTypeOf(plainDateTime(undefined)).toEqualTypeOf<Schema>();
    });

    it('with string message', () => {
      expectTypeOf(plainDateTime('message')).toEqualTypeOf<PlainDateTimeSchema<'message'>>();
    });

    it('with function message', () => {
      expectTypeOf(plainDateTime(() => 'message')).toEqualTypeOf<PlainDateTimeSchema<() => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Schema = PlainDateTimeSchema<undefined>;

    it('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<Temporal.PlainDateTime>();
    });

    it('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<Temporal.PlainDateTime>();
    });

    it('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<PlainDateTimeIssue>();
    });
  });
});
