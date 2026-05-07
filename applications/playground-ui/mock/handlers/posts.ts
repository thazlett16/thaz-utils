import { Temporal } from '@js-temporal/polyfill';
import { http, HttpResponse } from 'msw';

import type { PostResponses } from '#src/services/post/options';

const MOCK_POSTS: PostResponses['GetPosts']['data'] = [
  {
    id: 1,
    title: 'First Post',
    body: 'Content of the first post.',
    created_at_timestamp: Temporal.Instant.from('2024-01-01T00:00:00Z'),
    created_by: 'user-1',
    updated_at_timestamp: Temporal.Instant.from('2024-01-01T00:00:00Z'),
    updated_by: 'user-1',
  },
  {
    id: 2,
    title: 'Second Post',
    body: 'Content of the second post.',
    created_at_timestamp: Temporal.Instant.from('2024-01-02T00:00:00Z'),
    created_by: 'user-1',
    updated_at_timestamp: Temporal.Instant.from('2024-01-02T00:00:00Z'),
    updated_by: 'user-1',
  },
  {
    id: 3,
    title: 'Third Post',
    body: 'Content of the third post.',
    created_at_timestamp: Temporal.Instant.from('2024-01-03T00:00:00Z'),
    created_by: 'user-2',
    updated_at_timestamp: Temporal.Instant.from('2024-01-03T00:00:00Z'),
    updated_by: 'user-2',
  },
];

export const getPostsHandler = {
  success: http.get('/api/posts', () =>
    HttpResponse.json<PostResponses['GetPosts']>({ message_list: [], data: MOCK_POSTS }),
  ),
  error400: http.get('/api/posts', () =>
    HttpResponse.json<PostResponses['GetPosts400']>(
      { message_list: [{ type: 'ERROR' as const, code: 'BAD_REQUEST', description: 'Bad request' }] },
      { status: 400 },
    ),
  ),
  error401: http.get('/api/posts', () =>
    HttpResponse.json<PostResponses['GetPosts401']>(
      { message_list: [{ type: 'ERROR' as const, code: 'UNAUTHORIZED', description: 'Unauthorized' }] },
      { status: 401 },
    ),
  ),
  error403: http.get('/api/posts', () =>
    HttpResponse.json<PostResponses['GetPosts403']>(
      { message_list: [{ type: 'ERROR' as const, code: 'FORBIDDEN', description: 'Forbidden' }] },
      { status: 403 },
    ),
  ),
  error500: http.get('/api/posts', () =>
    HttpResponse.json<PostResponses['GetPosts500']>(
      {
        message_list: [{ type: 'ERROR' as const, code: 'INTERNAL_SERVER_ERROR', description: 'Internal server error' }],
      },
      { status: 500 },
    ),
  ),
};

export const getPostByIdHandler = {
  success: http.get('/api/posts/:id', ({ params }) => {
    const post = MOCK_POSTS.find((p) => p.id === Number(params['id']));
    if (!post) {
      return HttpResponse.json<PostResponses['GetPostById404']>(
        { message_list: [{ type: 'ERROR' as const, code: 'NOT_FOUND', description: 'Not found' }] },
        { status: 404 },
      );
    }

    return HttpResponse.json<PostResponses['GetPostById']>({ message_list: [], data: post });
  }),
  error400: http.get('/api/posts/:id', () =>
    HttpResponse.json<PostResponses['GetPostById400']>(
      { message_list: [{ type: 'ERROR' as const, code: 'BAD_REQUEST', description: 'Bad request' }] },
      { status: 400 },
    ),
  ),
  error401: http.get('/api/posts/:id', () =>
    HttpResponse.json<PostResponses['GetPostById401']>(
      { message_list: [{ type: 'ERROR' as const, code: 'UNAUTHORIZED', description: 'Unauthorized' }] },
      { status: 401 },
    ),
  ),
  error403: http.get('/api/posts/:id', () =>
    HttpResponse.json<PostResponses['GetPostById403']>(
      { message_list: [{ type: 'ERROR' as const, code: 'FORBIDDEN', description: 'Forbidden' }] },
      { status: 403 },
    ),
  ),
  error404: http.get('/api/posts/:id', () =>
    HttpResponse.json<PostResponses['GetPostById404']>(
      { message_list: [{ type: 'ERROR' as const, code: 'NOT_FOUND', description: 'Not found' }] },
      { status: 404 },
    ),
  ),
  error500: http.get('/api/posts/:id', () =>
    HttpResponse.json<PostResponses['GetPostById500']>(
      {
        message_list: [{ type: 'ERROR' as const, code: 'INTERNAL_SERVER_ERROR', description: 'Internal server error' }],
      },
      { status: 500 },
    ),
  ),
};

export const createPostHandler = {
  success: http.post('/api/posts', () => HttpResponse.json<PostResponses['CreatePost']>({ message_list: [] })),
  error400: http.post('/api/posts', () =>
    HttpResponse.json<PostResponses['CreatePost400']>(
      { message_list: [{ type: 'ERROR' as const, code: 'BAD_REQUEST', description: 'Bad request' }] },
      { status: 400 },
    ),
  ),
  error401: http.post('/api/posts', () =>
    HttpResponse.json<PostResponses['CreatePost401']>(
      { message_list: [{ type: 'ERROR' as const, code: 'UNAUTHORIZED', description: 'Unauthorized' }] },
      { status: 401 },
    ),
  ),
  error403: http.post('/api/posts', () =>
    HttpResponse.json<PostResponses['CreatePost403']>(
      { message_list: [{ type: 'ERROR' as const, code: 'FORBIDDEN', description: 'Forbidden' }] },
      { status: 403 },
    ),
  ),
  error500: http.post('/api/posts', () =>
    HttpResponse.json<PostResponses['CreatePost500']>(
      {
        message_list: [{ type: 'ERROR' as const, code: 'INTERNAL_SERVER_ERROR', description: 'Internal server error' }],
      },
      { status: 500 },
    ),
  ),
};

export const updatePostHandler = {
  success: http.put('/api/posts', () => HttpResponse.json<PostResponses['UpdatePost']>({ message_list: [] })),
  error400: http.put('/api/posts', () =>
    HttpResponse.json<PostResponses['UpdatePost400']>(
      { message_list: [{ type: 'ERROR' as const, code: 'BAD_REQUEST', description: 'Bad request' }] },
      { status: 400 },
    ),
  ),
  error401: http.put('/api/posts', () =>
    HttpResponse.json<PostResponses['UpdatePost401']>(
      { message_list: [{ type: 'ERROR' as const, code: 'UNAUTHORIZED', description: 'Unauthorized' }] },
      { status: 401 },
    ),
  ),
  error403: http.put('/api/posts', () =>
    HttpResponse.json<PostResponses['UpdatePost403']>(
      { message_list: [{ type: 'ERROR' as const, code: 'FORBIDDEN', description: 'Forbidden' }] },
      { status: 403 },
    ),
  ),
  error404: http.put('/api/posts', () =>
    HttpResponse.json<PostResponses['UpdatePost404']>(
      { message_list: [{ type: 'ERROR' as const, code: 'NOT_FOUND', description: 'Not found' }] },
      { status: 404 },
    ),
  ),
  error500: http.put('/api/posts', () =>
    HttpResponse.json<PostResponses['UpdatePost500']>(
      {
        message_list: [{ type: 'ERROR' as const, code: 'INTERNAL_SERVER_ERROR', description: 'Internal server error' }],
      },
      { status: 500 },
    ),
  ),
};

export const deletePostByIdHandler = {
  success: http.delete('/api/posts/:id', () =>
    HttpResponse.json<PostResponses['DeletePostById']>({ message_list: [] }),
  ),
  error400: http.delete('/api/posts/:id', () =>
    HttpResponse.json<PostResponses['DeletePostById400']>(
      { message_list: [{ type: 'ERROR' as const, code: 'BAD_REQUEST', description: 'Bad request' }] },
      { status: 400 },
    ),
  ),
  error401: http.delete('/api/posts/:id', () =>
    HttpResponse.json<PostResponses['DeletePostById401']>(
      { message_list: [{ type: 'ERROR' as const, code: 'UNAUTHORIZED', description: 'Unauthorized' }] },
      { status: 401 },
    ),
  ),
  error403: http.delete('/api/posts/:id', () =>
    HttpResponse.json<PostResponses['DeletePostById403']>(
      { message_list: [{ type: 'ERROR' as const, code: 'FORBIDDEN', description: 'Forbidden' }] },
      { status: 403 },
    ),
  ),
  error404: http.delete('/api/posts/:id', () =>
    HttpResponse.json<PostResponses['DeletePostById404']>(
      { message_list: [{ type: 'ERROR' as const, code: 'NOT_FOUND', description: 'Not found' }] },
      { status: 404 },
    ),
  ),
  error500: http.delete('/api/posts/:id', () =>
    HttpResponse.json<PostResponses['DeletePostById500']>(
      {
        message_list: [{ type: 'ERROR' as const, code: 'INTERNAL_SERVER_ERROR', description: 'Internal server error' }],
      },
      { status: 500 },
    ),
  ),
};

export const handlers = [
  getPostsHandler.success,
  getPostByIdHandler.success,
  createPostHandler.success,
  updatePostHandler.success,
  deletePostByIdHandler.success,
];
