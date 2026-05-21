import type { Temporal } from '@js-temporal/polyfill';
import type { InferOutput } from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { softDeletedEntity } from '#src/valibot/entity/soft-deleted-entity';

describe('softDeletedEntity schema', () => {
  describe('should infer correct types', () => {
    test('output has soft_deleted_at_timestamp as Instant or null', () => {
      expectTypeOf<InferOutput<typeof softDeletedEntity>>().toEqualTypeOf<{
        soft_deleted_at_timestamp: Temporal.Instant | null;
      }>();
    });
  });
});
