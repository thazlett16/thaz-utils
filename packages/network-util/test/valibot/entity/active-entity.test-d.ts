import type { Temporal } from '@js-temporal/polyfill';
import type { InferOutput } from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { activeEntity } from '#src/valibot/entity/active-entity';

describe('activeEntity schema', () => {
  describe('should infer correct types', () => {
    test('output has active_at_timestamp as Instant and expired_at_timestamp as Instant or null', () => {
      expectTypeOf<InferOutput<typeof activeEntity>>().toEqualTypeOf<{
        active_at_timestamp: Temporal.Instant;
        expired_at_timestamp: Temporal.Instant | null;
      }>();
    });
  });
});
