import type * as v from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import { responseBoolean } from '#src/valibot/schema/boolean';

describe('responseBoolean', () => {
  describe('should infer correct types', () => {
    const schema = responseBoolean(true);

    test('input accepts boolean, null, or undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<boolean | null | undefined>();
    });

    test('output is always boolean', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<boolean>();
    });
  });
});
