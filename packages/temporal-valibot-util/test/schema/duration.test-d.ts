import type { Temporal } from '@js-temporal/polyfill';
import type { InferInput, InferIssue, InferOutput } from 'valibot';

import { describe, expectTypeOf, test } from 'vitest';

import type { DurationIssue, DurationSchema } from '../../src/schema/duration';

import { duration } from '../../src/schema/duration';

describe('duration', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = DurationSchema<undefined>;
      expectTypeOf(duration()).toEqualTypeOf<Schema>();
      expectTypeOf(duration(undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(duration('message')).toEqualTypeOf<DurationSchema<'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(duration(() => 'message')).toEqualTypeOf<DurationSchema<() => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Schema = DurationSchema<undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<Temporal.Duration>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<Temporal.Duration>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<DurationIssue>();
    });
  });
});
