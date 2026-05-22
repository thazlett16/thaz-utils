import type { Temporal } from '@js-temporal/polyfill';
import type { InferOutput } from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { baseEntity } from '#src/valibot/entity/base-entity';

describe('baseEntity schema', () => {
  describe('should infer correct types', () => {
    test('output has Temporal.Instant timestamps and string creator fields', () => {
      expectTypeOf<InferOutput<typeof baseEntity>>().toEqualTypeOf<{
        created_at_timestamp: Temporal.Instant;
        created_by: string;
        updated_at_timestamp: Temporal.Instant;
        updated_by: string;
      }>();
    });
  });
});
