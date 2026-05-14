import * as v from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import { responseArray } from '#src/valibot/schema/array';

describe('responseArray', () => {
  describe('should infer correct types', () => {
    const schema = responseArray(v.string());

    test('input accepts array, null, or undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<string[] | null | undefined>();
    });

    test('output is always an array', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<string[]>();
    });

    test('works with object schemas', () => {
      const objectSchema = responseArray(v.object({ id: v.number() }));
      expectTypeOf<v.InferOutput<typeof objectSchema>>().toEqualTypeOf<{ id: number }[]>();
    });
  });
});
