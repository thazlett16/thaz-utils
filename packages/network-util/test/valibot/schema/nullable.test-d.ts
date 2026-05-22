import * as v from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import { responseNullable } from '#src/valibot/schema/nullable';

describe('responseNullable', () => {
  describe('should infer correct types - primitive', () => {
    const schema = responseNullable(v.string());

    test('input type', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<string | NonNullable<unknown> | null | undefined>();
    });

    test('output type', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<string | null>();
    });
  });

  describe('should infer correct types - object', () => {
    const schema = responseNullable(v.object({ id: v.number() }));

    test('input type', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        { id: number } | NonNullable<unknown> | null | undefined
      >();
    });

    test('output type', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<{ id: number } | null>();
    });
  });

  describe('should infer correct types - nested', () => {
    const schema = responseNullable(
      v.object({
        test1: v.string(),
        test2: v.number(),
        test3: responseNullable(v.string()),
      }),
    );

    test('input type', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        | { test1: string; test2: number; test3?: string | NonNullable<unknown> | null | undefined }
        | NonNullable<unknown>
        | null
        | undefined
      >();
    });

    test('output type', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<{
        test1: string;
        test2: number;
        test3: string | null;
      } | null>();
    });
  });
});
