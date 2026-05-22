import type { InferOutput } from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { extendedAuditEntity } from '#src/valibot/entity/extended-audit-entity';

describe('extendedAuditEntity schema', () => {
  describe('should infer correct types', () => {
    test('output has nullable string fields for all audit fields', () => {
      expectTypeOf<InferOutput<typeof extendedAuditEntity>>().toEqualTypeOf<{
        created_by_process: string | null;
        created_by_user_id: string | null;
        updated_by_process: string | null;
        updated_by_user_id: string | null;
      }>();
    });
  });
});
