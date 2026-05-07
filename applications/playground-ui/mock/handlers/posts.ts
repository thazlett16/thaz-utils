import { http, HttpResponse } from 'msw';

import type { Post } from '#src/services/posts-contract';

const MOCK_POSTS: Post[] = [
  { id: 1, title: 'First Post', body: 'Content of the first post.', userId: 1 },
  { id: 2, title: 'Second Post', body: 'Content of the second post.', userId: 1 },
  { id: 3, title: 'Third Post', body: 'Content of the third post.', userId: 2 },
];

export const getPostsHandler = http.get('/api/posts', () => {
  return HttpResponse.json(MOCK_POSTS);
});

export const getPostByIdHandler = http.get('/api/posts/:id', ({ params }) => {
  const post = MOCK_POSTS.find((p) => p.id === Number(params['id']));
  if (!post) {
    return HttpResponse.json({ message: 'Post not found' }, { status: 404 });
  }
  return HttpResponse.json(post);
});

export const getPostsErrorHandler = http.get('/api/posts', () => {
  return HttpResponse.json({ message: 'Internal server error' }, { status: 500 });
});

export const getPostByIdErrorHandler = http.get('/api/posts/:id', () => {
  return HttpResponse.json({ message: 'Internal server error' }, { status: 500 });
});

export const handlers = [getPostsHandler, getPostByIdHandler];

export const errorHandlers = {
  getPosts: getPostsErrorHandler,
  getPostById: getPostByIdErrorHandler,
};
