import * as v from 'valibot';

import { instant } from '#src/valibot/schema/instant/schema';

export const baseEntity = v.object({
  created_at_timestamp: instant,
  created_by: v.string(),
  updated_at_timestamp: instant,
  updated_by: v.string(),
});

// type InputBaseEntity = v.InferInput<typeof baseEntity>
// type OutputBaseEntity = v.InferOutput<typeof baseEntity>
