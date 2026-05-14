import type { Temporal } from '@js-temporal/polyfill';
import type { InferInput, InferOutput } from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { plainDateTime } from '#src/valibot/schema/plain-date-time';

describe('plainDateTime', () => {
  describe('should infer correct types', () => {
    test('input accepts Temporal.PlainDateTime or string', () => {
      expectTypeOf<InferInput<typeof plainDateTime>>().toEqualTypeOf<Temporal.PlainDateTime | string>();
    });

    test('output is Temporal.PlainDateTime', () => {
      expectTypeOf<InferOutput<typeof plainDateTime>>().toEqualTypeOf<Temporal.PlainDateTime>();
    });
  });
});
