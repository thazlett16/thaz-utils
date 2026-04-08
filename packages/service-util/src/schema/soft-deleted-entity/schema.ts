import * as v from 'valibot';

import { instant } from '#src/schema/instant/schema';
import { responseNullable } from '#src/schema/nullable/schema';

export const softDeletedEntity = v.object({
    soft_deleted_at_timestamp: responseNullable(instant),
});

// type InputSoftDeletedEntity = v.InferInput<typeof softDeletedEntity>
// type OutputSoftDeletedEntity = v.InferOutput<typeof softDeletedEntity>
