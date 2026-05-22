import * as v from 'valibot';

import { instant } from '#src/valibot/schema/instant';
import { responseNullable } from '#src/valibot/schema/nullable';

/**
 * Valibot schema for the soft-delete timestamp field.
 */
export const softDeletedEntity = v.object({
  soft_deleted_at_timestamp: responseNullable(instant),
});
