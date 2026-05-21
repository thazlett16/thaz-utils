import * as v from 'valibot';

import { responseNullable } from '#src/valibot/schema/nullable';

export const extendedAuditEntity = v.object({
  created_by_process: responseNullable(v.string()),
  created_by_user_id: responseNullable(v.string()),
  updated_by_process: responseNullable(v.string()),
  updated_by_user_id: responseNullable(v.string()),
});
