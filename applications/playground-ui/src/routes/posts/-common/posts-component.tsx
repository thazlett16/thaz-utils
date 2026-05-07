import { useQuery } from '@tanstack/react-query';

import { postOptions } from '#src/services/post/options';

export function PostsComponent() {
  const { data: posts, isLoading, isError, error } = useQuery(postOptions.getPostsQueryOptions());

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
        {posts?.data.map((post) => (
          <li key={post.id}>
            <strong>{post.title}</strong>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
