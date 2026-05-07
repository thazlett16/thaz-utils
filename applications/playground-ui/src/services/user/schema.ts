import * as n from '@thazstack/network-util';

import * as v from 'valibot';

export const baseUserSchema = v.object({
  id: v.number(),
  name: v.string(),
  email: v.string(),
});

export const userSchema = v.object({
  ...baseUserSchema.entries,
  ...n.baseEntity.entries,
});
