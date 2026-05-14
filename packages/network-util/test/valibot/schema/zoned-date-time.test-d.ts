import type { Temporal } from '@js-temporal/polyfill';
import type { InferInput, InferOutput } from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { zonedDateTime } from '#src/valibot/schema/zoned-date-time';

describe('zonedDateTime', () => {
  describe('should infer correct types', () => {
    test('input accepts Temporal.ZonedDateTime or string', () => {
      expectTypeOf<InferInput<typeof zonedDateTime>>().toEqualTypeOf<Temporal.ZonedDateTime | string>();
    });

    test('output is Temporal.ZonedDateTime', () => {
      expectTypeOf<InferOutput<typeof zonedDateTime>>().toEqualTypeOf<Temporal.ZonedDateTime>();
    });
  });
});
