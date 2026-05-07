import * as n from '@thazstack/network-util';

import * as v from 'valibot';

export const basePostSchema = v.object({
  id: v.number(),
  title: v.string(),
  body: v.string(),
});

export const postSchema = v.object({
  ...basePostSchema.entries,
  ...n.baseEntity.entries,
});
