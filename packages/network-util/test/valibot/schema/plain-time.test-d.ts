import type { Temporal } from '@js-temporal/polyfill';
import type { InferInput, InferOutput } from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { plainTime } from '#src/valibot/schema/plain-time';

describe('plainTime', () => {
  describe('should infer correct types', () => {
    test('input accepts Temporal.PlainTime or string', () => {
      expectTypeOf<InferInput<typeof plainTime>>().toEqualTypeOf<Temporal.PlainTime | string>();
    });

    test('output is Temporal.PlainTime', () => {
      expectTypeOf<InferOutput<typeof plainTime>>().toEqualTypeOf<Temporal.PlainTime>();
    });
  });
});
