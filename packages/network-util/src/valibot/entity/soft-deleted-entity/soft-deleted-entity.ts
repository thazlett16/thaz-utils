import * as v from 'valibot';

import { instant } from '#src/valibot/schema/instant/instant';
import { responseNullable } from '#src/valibot/schema/nullable/nullable';

export const softDeletedEntity = v.object({
  soft_deleted_at_timestamp: responseNullable(instant),
});

// type InputSoftDeletedEntity = v.InferInput<typeof softDeletedEntity>
// type OutputSoftDeletedEntity = v.InferOutput<typeof softDeletedEntity>
