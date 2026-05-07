import { queryOptions, mutationOptions } from '@tanstack/react-query';

import * as n from '@thazstack/network-util';

import { Temporal } from '@js-temporal/polyfill';
import type { ClientInferRequest, ClientInferResponseBody } from '@ts-rest/core';
import { initClient } from '@ts-rest/core';

import { postContract } from './contract';

const postClient = initClient(postContract, {
  baseUrl: '/api',
  validateResponse: true,
});

export interface PostResponses {
  GetPosts: ClientInferResponseBody<typeof postContract.getPosts, 200>;
  GetPosts400: ClientInferResponseBody<typeof postContract.getPosts, 400>;
  GetPosts401: ClientInferResponseBody<typeof postContract.getPosts, 401>;
  GetPosts403: ClientInferResponseBody<typeof postContract.getPosts, 403>;
  GetPosts500: ClientInferResponseBody<typeof postContract.getPosts, 500>;
  GetPostById: ClientInferResponseBody<typeof postContract.getPostById, 200>;
  GetPostById400: ClientInferResponseBody<typeof postContract.getPostById, 400>;
  GetPostById401: ClientInferResponseBody<typeof postContract.getPostById, 401>;
  GetPostById403: ClientInferResponseBody<typeof postContract.getPostById, 403>;
  GetPostById404: ClientInferResponseBody<typeof postContract.getPostById, 404>;
  GetPostById500: ClientInferResponseBody<typeof postContract.getPostById, 500>;
  CreatePost: ClientInferResponseBody<typeof postContract.createPost, 200>;
  CreatePost400: ClientInferResponseBody<typeof postContract.createPost, 400>;
  CreatePost401: ClientInferResponseBody<typeof postContract.createPost, 401>;
  CreatePost403: ClientInferResponseBody<typeof postContract.createPost, 403>;
  CreatePost500: ClientInferResponseBody<typeof postContract.createPost, 500>;
  UpdatePost: ClientInferResponseBody<typeof postContract.updatePost, 200>;
  UpdatePost400: ClientInferResponseBody<typeof postContract.updatePost, 400>;
  UpdatePost401: ClientInferResponseBody<typeof postContract.updatePost, 401>;
  UpdatePost403: ClientInferResponseBody<typeof postContract.updatePost, 403>;
  UpdatePost404: ClientInferResponseBody<typeof postContract.updatePost, 404>;
  UpdatePost500: ClientInferResponseBody<typeof postContract.updatePost, 500>;
  DeletePostById: ClientInferResponseBody<typeof postContract.deletePostById, 200>;
  DeletePostById400: ClientInferResponseBody<typeof postContract.deletePostById, 400>;
  DeletePostById401: ClientInferResponseBody<typeof postContract.deletePostById, 401>;
  DeletePostById403: ClientInferResponseBody<typeof postContract.deletePostById, 403>;
  DeletePostById404: ClientInferResponseBody<typeof postContract.deletePostById, 404>;
  DeletePostById500: ClientInferResponseBody<typeof postContract.deletePostById, 500>;
}

export const postOptions = {
  serviceEntity: () => ['post'] as const,

  getPosts: () => [postOptions.serviceEntity(), 'getPosts'],
  getPostsQueryOptions: () => {
    return queryOptions({
      staleTime: Temporal.Duration.from({ minutes: 10 }).total({ unit: 'milliseconds' }),
      queryKey: [postOptions.getPosts()],
      queryFn: async ({ signal }) => {
        const {
          status,
          body: responseBody,
          headers: responseHeaders,
        } = await postClient.getPosts({
          headers: {},
          fetchOptions: {
            signal,
          },
        });

        n.refineNetworkError(status, 200, responseBody, responseHeaders);

        return responseBody;
      },
    });
  },

  getPostById: () => [postOptions.serviceEntity(), 'getPostById'],
  getPostByIdQueryOptions: ({ params }: { params: ClientInferRequest<typeof postContract.getPostById>['params'] }) => {
    return queryOptions({
      staleTime: Temporal.Duration.from({ minutes: 10 }).total({ unit: 'milliseconds' }),
      queryKey: [postOptions.getPostById(), params],
      queryFn: async ({ signal }) => {
        const {
          status,
          body: responseBody,
          headers: responseHeaders,
        } = await postClient.getPostById({
          headers: {},
          params,
          fetchOptions: {
            signal,
          },
        });

        n.refineNetworkError(status, 200, responseBody, responseHeaders);

        return responseBody;
      },
    });
  },

  createPostMutationOptions: mutationOptions({
    mutationFn: async ({
      body,
      signal,
    }: {
      body: ClientInferRequest<typeof postContract.createPost>['body'];
      signal?: AbortSignal;
    }) => {
      const {
        status,
        body: responseBody,
        headers: responseHeaders,
      } = await postClient.createPost({
        headers: {},
        body,
        fetchOptions: {
          signal: signal ?? null,
        },
      });

      n.refineNetworkError(status, 200, responseBody, responseHeaders);

      return responseBody;
    },
    onSuccess: async (_data, _variables, _onMutateResult, { client }) => {
      await client.invalidateQueries();
    },
  }),

  updatePostMutationOptions: mutationOptions({
    mutationFn: async ({
      body,
      signal,
    }: {
      body: ClientInferRequest<typeof postContract.updatePost>['body'];
      signal?: AbortSignal;
    }) => {
      const {
        status,
        body: responseBody,
        headers: responseHeaders,
      } = await postClient.updatePost({
        headers: {},
        body,
        fetchOptions: {
          signal: signal ?? null,
        },
      });

      n.refineNetworkError(status, 200, responseBody, responseHeaders);

      return responseBody;
    },
    onSuccess: async (_data, _variables, _onMutateResult, { client }) => {
      await client.invalidateQueries();
    },
  }),

  deletePostByIdMutationOptions: mutationOptions({
    mutationFn: async ({
      params,
      signal,
    }: {
      params: ClientInferRequest<typeof postContract.deletePostById>['params'];
      signal?: AbortSignal;
    }) => {
      const {
        status,
        body: responseBody,
        headers: responseHeaders,
      } = await postClient.deletePostById({
        headers: {},
        params,
        fetchOptions: {
          signal: signal ?? null,
        },
      });

      n.refineNetworkError(status, 200, responseBody, responseHeaders);

      return responseBody;
    },
    onSuccess: async (_data, _variables, _onMutateResult, { client }) => {
      await client.invalidateQueries();
    },
  }),
};
