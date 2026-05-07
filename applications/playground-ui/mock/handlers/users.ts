import { Temporal } from '@js-temporal/polyfill';
import { http, HttpResponse } from 'msw';

import type { UserResponses } from '#src/services/user/options';

const MOCK_USERS: UserResponses['GetUsers']['data'] = [
  {
    id: 1,
    name: 'Alice Smith',
    email: 'alice@example.com',
    created_at_timestamp: Temporal.Instant.from('2024-01-01T00:00:00Z'),
    created_by: 'user-1',
    updated_at_timestamp: Temporal.Instant.from('2024-01-01T00:00:00Z'),
    updated_by: 'user-1',
  },
  {
    id: 2,
    name: 'Bob Jones',
    email: 'bob@example.com',
    created_at_timestamp: Temporal.Instant.from('2024-01-02T00:00:00Z'),
    created_by: 'user-1',
    updated_at_timestamp: Temporal.Instant.from('2024-01-02T00:00:00Z'),
    updated_by: 'user-1',
  },
];

export const getUsersHandler = {
  success: http.get('/api/users', () =>
    HttpResponse.json<UserResponses['GetUsers']>({ message_list: [], data: MOCK_USERS }),
  ),
  error400: http.get('/api/users', () =>
    HttpResponse.json<UserResponses['GetUsers400']>(
      { message_list: [{ type: 'ERROR' as const, code: 'BAD_REQUEST', description: 'Bad request' }] },
      { status: 400 },
    ),
  ),
  error401: http.get('/api/users', () =>
    HttpResponse.json<UserResponses['GetUsers401']>(
      { message_list: [{ type: 'ERROR' as const, code: 'UNAUTHORIZED', description: 'Unauthorized' }] },
      { status: 401 },
    ),
  ),
  error403: http.get('/api/users', () =>
    HttpResponse.json<UserResponses['GetUsers403']>(
      { message_list: [{ type: 'ERROR' as const, code: 'FORBIDDEN', description: 'Forbidden' }] },
      { status: 403 },
    ),
  ),
  error500: http.get('/api/users', () =>
    HttpResponse.json<UserResponses['GetUsers500']>(
      {
        message_list: [{ type: 'ERROR' as const, code: 'INTERNAL_SERVER_ERROR', description: 'Internal server error' }],
      },
      { status: 500 },
    ),
  ),
};

export const getUserByIdHandler = {
  success: http.get('/api/users/:id', ({ params }) => {
    const user = MOCK_USERS.find((u) => u.id === Number(params['id']));
    if (!user) {
      return HttpResponse.json<UserResponses['GetUserById404']>(
        { message_list: [{ type: 'ERROR' as const, code: 'NOT_FOUND', description: 'Not found' }] },
        { status: 404 },
      );
    }

    return HttpResponse.json<UserResponses['GetUserById']>({ message_list: [], data: user });
  }),
  error400: http.get('/api/users/:id', () =>
    HttpResponse.json<UserResponses['GetUserById400']>(
      { message_list: [{ type: 'ERROR' as const, code: 'BAD_REQUEST', description: 'Bad request' }] },
      { status: 400 },
    ),
  ),
  error401: http.get('/api/users/:id', () =>
    HttpResponse.json<UserResponses['GetUserById401']>(
      { message_list: [{ type: 'ERROR' as const, code: 'UNAUTHORIZED', description: 'Unauthorized' }] },
      { status: 401 },
    ),
  ),
  error403: http.get('/api/users/:id', () =>
    HttpResponse.json<UserResponses['GetUserById403']>(
      { message_list: [{ type: 'ERROR' as const, code: 'FORBIDDEN', description: 'Forbidden' }] },
      { status: 403 },
    ),
  ),
  error404: http.get('/api/users/:id', () =>
    HttpResponse.json<UserResponses['GetUserById404']>(
      { message_list: [{ type: 'ERROR' as const, code: 'NOT_FOUND', description: 'Not found' }] },
      { status: 404 },
    ),
  ),
  error500: http.get('/api/users/:id', () =>
    HttpResponse.json<UserResponses['GetUserById500']>(
      {
        message_list: [{ type: 'ERROR' as const, code: 'INTERNAL_SERVER_ERROR', description: 'Internal server error' }],
      },
      { status: 500 },
    ),
  ),
};

export const createUserHandler = {
  success: http.post('/api/users', () => HttpResponse.json<UserResponses['CreateUser']>({ message_list: [] })),
  error400: http.post('/api/users', () =>
    HttpResponse.json<UserResponses['CreateUser400']>(
      { message_list: [{ type: 'ERROR' as const, code: 'BAD_REQUEST', description: 'Bad request' }] },
      { status: 400 },
    ),
  ),
  error401: http.post('/api/users', () =>
    HttpResponse.json<UserResponses['CreateUser401']>(
      { message_list: [{ type: 'ERROR' as const, code: 'UNAUTHORIZED', description: 'Unauthorized' }] },
      { status: 401 },
    ),
  ),
  error403: http.post('/api/users', () =>
    HttpResponse.json<UserResponses['CreateUser403']>(
      { message_list: [{ type: 'ERROR' as const, code: 'FORBIDDEN', description: 'Forbidden' }] },
      { status: 403 },
    ),
  ),
  error500: http.post('/api/users', () =>
    HttpResponse.json<UserResponses['CreateUser500']>(
      {
        message_list: [{ type: 'ERROR' as const, code: 'INTERNAL_SERVER_ERROR', description: 'Internal server error' }],
      },
      { status: 500 },
    ),
  ),
};

export const updateUserHandler = {
  success: http.put('/api/users', () => HttpResponse.json<UserResponses['UpdateUser']>({ message_list: [] })),
  error400: http.put('/api/users', () =>
    HttpResponse.json<UserResponses['UpdateUser400']>(
      { message_list: [{ type: 'ERROR' as const, code: 'BAD_REQUEST', description: 'Bad request' }] },
      { status: 400 },
    ),
  ),
  error401: http.put('/api/users', () =>
    HttpResponse.json<UserResponses['UpdateUser401']>(
      { message_list: [{ type: 'ERROR' as const, code: 'UNAUTHORIZED', description: 'Unauthorized' }] },
      { status: 401 },
    ),
  ),
  error403: http.put('/api/users', () =>
    HttpResponse.json<UserResponses['UpdateUser403']>(
      { message_list: [{ type: 'ERROR' as const, code: 'FORBIDDEN', description: 'Forbidden' }] },
      { status: 403 },
    ),
  ),
  error404: http.put('/api/users', () =>
    HttpResponse.json<UserResponses['UpdateUser404']>(
      { message_list: [{ type: 'ERROR' as const, code: 'NOT_FOUND', description: 'Not found' }] },
      { status: 404 },
    ),
  ),
  error500: http.put('/api/users', () =>
    HttpResponse.json<UserResponses['UpdateUser500']>(
      {
        message_list: [{ type: 'ERROR' as const, code: 'INTERNAL_SERVER_ERROR', description: 'Internal server error' }],
      },
      { status: 500 },
    ),
  ),
};

export const deleteUserByIdHandler = {
  success: http.delete('/api/users/:id', () =>
    HttpResponse.json<UserResponses['DeleteUserById']>({ message_list: [] }),
  ),
  error400: http.delete('/api/users/:id', () =>
    HttpResponse.json<UserResponses['DeleteUserById400']>(
      { message_list: [{ type: 'ERROR' as const, code: 'BAD_REQUEST', description: 'Bad request' }] },
      { status: 400 },
    ),
  ),
  error401: http.delete('/api/users/:id', () =>
    HttpResponse.json<UserResponses['DeleteUserById401']>(
      { message_list: [{ type: 'ERROR' as const, code: 'UNAUTHORIZED', description: 'Unauthorized' }] },
      { status: 401 },
    ),
  ),
  error403: http.delete('/api/users/:id', () =>
    HttpResponse.json<UserResponses['DeleteUserById403']>(
      { message_list: [{ type: 'ERROR' as const, code: 'FORBIDDEN', description: 'Forbidden' }] },
      { status: 403 },
    ),
  ),
  error404: http.delete('/api/users/:id', () =>
    HttpResponse.json<UserResponses['DeleteUserById404']>(
      { message_list: [{ type: 'ERROR' as const, code: 'NOT_FOUND', description: 'Not found' }] },
      { status: 404 },
    ),
  ),
  error500: http.delete('/api/users/:id', () =>
    HttpResponse.json<UserResponses['DeleteUserById500']>(
      {
        message_list: [{ type: 'ERROR' as const, code: 'INTERNAL_SERVER_ERROR', description: 'Internal server error' }],
      },
      { status: 500 },
    ),
  ),
};

export const handlers = [
  getUsersHandler.success,
  getUserByIdHandler.success,
  createUserHandler.success,
  updateUserHandler.success,
  deleteUserByIdHandler.success,
];
