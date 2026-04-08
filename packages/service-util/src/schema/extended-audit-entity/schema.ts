import * as v from 'valibot';

import { responseNullable } from '#src/schema/nullable/schema';

export const extendedAuditEntity = v.object({
    created_by_process: responseNullable(v.string()),
    created_by_user_id: responseNullable(v.string()),
    updated_by_process: responseNullable(v.string()),
    updated_by_user_id: responseNullable(v.string()),
});

// type InputExtendedAuditEntity = v.InferInput<typeof extendedAuditEntity>
// type OutputExtendedAuditEntity = v.InferOutput<typeof extendedAuditEntity>
