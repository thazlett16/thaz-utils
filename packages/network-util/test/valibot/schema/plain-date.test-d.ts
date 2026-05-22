import type { Temporal } from '@js-temporal/polyfill';
import type { InferInput, InferOutput } from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { plainDate } from '#src/valibot/schema/plain-date';

describe('plainDate', () => {
  describe('should infer correct types', () => {
    test('input accepts Temporal.PlainDate or string', () => {
      expectTypeOf<InferInput<typeof plainDate>>().toEqualTypeOf<Temporal.PlainDate | string>();
    });

    test('output is Temporal.PlainDate', () => {
      expectTypeOf<InferOutput<typeof plainDate>>().toEqualTypeOf<Temporal.PlainDate>();
    });
  });
});
