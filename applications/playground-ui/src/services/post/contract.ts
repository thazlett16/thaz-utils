import * as n from '@thazstack/network-util';

import { initContract } from '@ts-rest/core';
import * as v from 'valibot';

import { postSchema } from './schema';

const c = initContract();

export const postContract = c.router(
  {
    getPosts: {
      method: 'GET',
      path: '/',
      responses: {
        200: v.object({
          ...n.response.entries,
          data: n.responseArray(postSchema),
        }),
        400: n.response,
        401: n.response,
        403: n.response,
        500: n.response,
      },
    },
    getPostById: {
      method: 'GET',
      path: '/:id',
      pathParams: v.object({
        id: v.string(),
      }),
      responses: {
        200: v.object({
          ...n.response.entries,
          data: postSchema,
        }),
        400: n.response,
        401: n.response,
        403: n.response,
        404: n.response,
        500: n.response,
      },
    },
    createPost: {
      method: 'POST',
      path: '/',
      body: v.object({
        title: v.string(),
        body: v.string(),
      }),
      responses: {
        200: n.response,
        400: n.response,
        401: n.response,
        403: n.response,
        500: n.response,
      },
    },
    updatePost: {
      method: 'PUT',
      path: '/',
      body: v.object({
        id: v.number(),
        title: v.string(),
        body: v.string(),
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
    deletePostById: {
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
    pathPrefix: '/posts',
    baseHeaders: {},
  },
);
