import { useQuery } from '@tanstack/react-query';

import { postsQueryOptions } from './posts-query-options';

export function PostsComponent() {
  const { data: posts, isLoading, isError, error } = useQuery(postsQueryOptions);

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  if (isError) {
    return <div>Error: {error instanceof Error ? error.message : 'Unknown error'}</div>;
  }

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts?.map((post) => (
          <li key={post.id}>
            <strong>{post.title}</strong>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
