import * as v from 'valibot';

import { instant } from '#src/valibot/schema/instant/instant';
import { responseNullable } from '#src/valibot/schema/nullable/nullable';

export const activeEntity = v.object({
  active_at_timestamp: instant,
  expired_at_timestamp: responseNullable(instant),
});

// type InputActiveEntity = v.InferInput<typeof activeEntity>
// type OutputActiveEntity = v.InferOutput<typeof activeEntity>
