import { http, HttpResponse } from 'msw';

export interface User {
  id: number;
  name: string;
  email: string;
}

const MOCK_USERS: User[] = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com' },
  { id: 2, name: 'Bob Jones', email: 'bob@example.com' },
];

export const getUsersHandler = http.get('/api/users', () => {
  return HttpResponse.json(MOCK_USERS);
});

export const getUserByIdHandler = http.get('/api/users/:id', ({ params }) => {
  const user = MOCK_USERS.find((u) => u.id === Number(params['id']));
  if (!user) {
    return HttpResponse.json({ message: 'User not found' }, { status: 404 });
  }
  return HttpResponse.json(user);
});

export const getUsersErrorHandler = http.get('/api/users', () => {
  return HttpResponse.json({ message: 'Internal server error' }, { status: 500 });
});

export const getUserByIdErrorHandler = http.get('/api/users/:id', () => {
  return HttpResponse.json({ message: 'Internal server error' }, { status: 500 });
});

export const handlers = [getUsersHandler, getUserByIdHandler];

export const errorHandlers = {
  getUsers: getUsersErrorHandler,
  getUserById: getUserByIdErrorHandler,
};
