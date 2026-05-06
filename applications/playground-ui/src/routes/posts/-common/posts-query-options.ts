import { queryOptions } from '@tanstack/react-query';

import * as v from 'valibot';

const postSchema = v.object({
  id: v.number(),
  title: v.string(),
  body: v.string(),
  userId: v.number(),
});

const postsResponseSchema = v.array(postSchema);

export const postsQueryOptions = queryOptions({
  queryKey: ['posts'],
  queryFn: async () => {
    const response = await fetch('/api/posts');
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }
    return v.parse(postsResponseSchema, await response.json());
  },
});
