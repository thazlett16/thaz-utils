import * as v from 'valibot';

import { instant } from '#src/schema/instant/schema';
import { responseNullable } from '#src/schema/nullable/schema';

export const activeEntity = v.object({
    active_at_timestamp: instant,
    expired_at_timestamp: responseNullable(instant),
});

// type InputActiveEntity = v.InferInput<typeof activeEntity>
// type OutputActiveEntity = v.InferOutput<typeof activeEntity>
