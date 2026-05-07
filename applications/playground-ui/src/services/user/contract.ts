import * as n from '@thazstack/network-util';

import { initContract } from '@ts-rest/core';
import * as v from 'valibot';

import { userSchema } from './schema';

const c = initContract();

export const userContract = c.router(
  {
    getUsers: {
      method: 'GET',
      path: '/',
      responses: {
        200: v.object({
          ...n.response.entries,
          data: n.responseArray(userSchema),
        }),
        400: n.response,
        401: n.response,
        403: n.response,
        500: n.response,
      },
    },
    getUserById: {
      method: 'GET',
      path: '/:id',
      pathParams: v.object({
        id: v.string(),
      }),
      responses: {
        200: v.object({
          ...n.response.entries,
          data: userSchema,
        }),
        400: n.response,
        401: n.response,
        403: n.response,
        404: n.response,
        500: n.response,
      },
    },
    createUser: {
      method: 'POST',
      path: '/',
      body: v.object({
        name: v.string(),
        email: v.string(),
      }),
      responses: {
        200: n.response,
        400: n.response,
        401: n.response,
        403: n.response,
        500: n.response,
      },
    },
    updateUser: {
      method: 'PUT',
      path: '/',
      body: v.object({
        id: v.number(),
        name: v.string(),
        email: v.string(),
      }),
      responses: {
        200: n.response,
        400: n.response,
        401: n.response,
        403: n.response,
        404: n.response,
        500: n.response,
      },
    },
    deleteUserById: {
      method: 'DELETE',
      path: '/:id',
      pathParams: v.object({
        id: v.string(),
      }),
      responses: {
        200: n.response,
        400: n.response,
        401: n.response,
        403: n.response,
        404: n.response,
        500: n.response,
      },
    },
  },
  {
    pathPrefix: '/users',
    baseHeaders: {},
  },
);
