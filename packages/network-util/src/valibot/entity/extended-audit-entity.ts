import * as v from 'valibot';

import { responseNullable } from '#src/valibot/schema/nullable';

/**
 * Valibot schema for the optional extended audit fields that identify the process or user
 * responsible for creation and last update.
 */
export const extendedAuditEntity = v.object({
  created_by_process: responseNullable(v.string()),
  created_by_user_id: responseNullable(v.string()),
  updated_by_process: responseNullable(v.string()),
  updated_by_user_id: responseNullable(v.string()),
});
