import * as v from 'valibot';

import { instant } from '#src/valibot/schema/instant';
import { responseNullable } from '#src/valibot/schema/nullable';

export const activeEntity = v.object({
  active_at_timestamp: instant,
  expired_at_timestamp: responseNullable(instant),
});
