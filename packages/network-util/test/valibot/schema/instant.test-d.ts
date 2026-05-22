import type { Temporal } from '@js-temporal/polyfill';
import type { InferInput, InferOutput } from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { instant } from '#src/valibot/schema/instant';

describe('instant', () => {
  describe('should infer correct types', () => {
    test('input accepts Temporal.Instant or string', () => {
      expectTypeOf<InferInput<typeof instant>>().toEqualTypeOf<Temporal.Instant | string>();
    });

    test('output is Temporal.Instant', () => {
      expectTypeOf<InferOutput<typeof instant>>().toEqualTypeOf<Temporal.Instant>();
    });
  });
});
