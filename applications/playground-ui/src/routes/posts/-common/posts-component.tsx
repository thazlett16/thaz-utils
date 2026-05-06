import { useQuery } from '@tanstack/react-query';

import { postsQueryOptions } from './posts-query-options';

export function PostsComponent() {
  const { data: posts, isLoading, isError, error } = useQuery(postsQueryOptions);

  if (isLoading) {
    return <div data-testid="posts-loading">Loading posts...</div>;
  }

  if (isError) {
    return <div data-testid="posts-error">Error: {error instanceof Error ? error.message : 'Unknown error'}</div>;
  }

  return (
    <div data-testid="posts-container">
      <h1>Posts</h1>
      <ul data-testid="posts-list">
        {posts?.map((post) => (
          <li
            key={post.id}
            data-testid={`post-item-${post.id.toString()}`}
          >
            <strong>{post.title}</strong>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
