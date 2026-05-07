import { queryOptions, mutationOptions } from '@tanstack/react-query';

import * as n from '@thazstack/network-util';

import { Temporal } from '@js-temporal/polyfill';
import type { ClientInferRequest, ClientInferResponseBody } from '@ts-rest/core';
import { initClient } from '@ts-rest/core';

import { userContract } from './contract';

const userClient = initClient(userContract, {
  baseUrl: '/api',
  validateResponse: true,
});

export interface UserResponses {
  GetUsers: ClientInferResponseBody<typeof userContract.getUsers, 200>;
  GetUsers400: ClientInferResponseBody<typeof userContract.getUsers, 400>;
  GetUsers401: ClientInferResponseBody<typeof userContract.getUsers, 401>;
  GetUsers403: ClientInferResponseBody<typeof userContract.getUsers, 403>;
  GetUsers500: ClientInferResponseBody<typeof userContract.getUsers, 500>;
  GetUserById: ClientInferResponseBody<typeof userContract.getUserById, 200>;
  GetUserById400: ClientInferResponseBody<typeof userContract.getUserById, 400>;
  GetUserById401: ClientInferResponseBody<typeof userContract.getUserById, 401>;
  GetUserById403: ClientInferResponseBody<typeof userContract.getUserById, 403>;
  GetUserById404: ClientInferResponseBody<typeof userContract.getUserById, 404>;
  GetUserById500: ClientInferResponseBody<typeof userContract.getUserById, 500>;
  CreateUser: ClientInferResponseBody<typeof userContract.createUser, 200>;
  CreateUser400: ClientInferResponseBody<typeof userContract.createUser, 400>;
  CreateUser401: ClientInferResponseBody<typeof userContract.createUser, 401>;
  CreateUser403: ClientInferResponseBody<typeof userContract.createUser, 403>;
  CreateUser500: ClientInferResponseBody<typeof userContract.createUser, 500>;
  UpdateUser: ClientInferResponseBody<typeof userContract.updateUser, 200>;
  UpdateUser400: ClientInferResponseBody<typeof userContract.updateUser, 400>;
  UpdateUser401: ClientInferResponseBody<typeof userContract.updateUser, 401>;
  UpdateUser403: ClientInferResponseBody<typeof userContract.updateUser, 403>;
  UpdateUser404: ClientInferResponseBody<typeof userContract.updateUser, 404>;
  UpdateUser500: ClientInferResponseBody<typeof userContract.updateUser, 500>;
  DeleteUserById: ClientInferResponseBody<typeof userContract.deleteUserById, 200>;
  DeleteUserById400: ClientInferResponseBody<typeof userContract.deleteUserById, 400>;
  DeleteUserById401: ClientInferResponseBody<typeof userContract.deleteUserById, 401>;
  DeleteUserById403: ClientInferResponseBody<typeof userContract.deleteUserById, 403>;
  DeleteUserById404: ClientInferResponseBody<typeof userContract.deleteUserById, 404>;
  DeleteUserById500: ClientInferResponseBody<typeof userContract.deleteUserById, 500>;
}

export const userOptions = {
  serviceEntity: () => ['user'] as const,

  getUsers: () => [userOptions.serviceEntity(), 'getUsers'],
  getUsersQueryOptions: () => {
    return queryOptions({
      staleTime: Temporal.Duration.from({ minutes: 10 }).total({ unit: 'milliseconds' }),
      queryKey: [userOptions.getUsers()],
      queryFn: async ({ signal }) => {
        const {
          status,
          body: responseBody,
          headers: responseHeaders,
        } = await userClient.getUsers({
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

  getUserById: () => [userOptions.serviceEntity(), 'getUserById'],
  getUserByIdQueryOptions: ({ params }: { params: ClientInferRequest<typeof userContract.getUserById>['params'] }) => {
    return queryOptions({
      staleTime: Temporal.Duration.from({ minutes: 10 }).total({ unit: 'milliseconds' }),
      queryKey: [userOptions.getUserById(), params],
      queryFn: async ({ signal }) => {
        const {
          status,
          body: responseBody,
          headers: responseHeaders,
        } = await userClient.getUserById({
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

  createUserMutationOptions: mutationOptions({
    mutationFn: async ({
      body,
      signal,
    }: {
      body: ClientInferRequest<typeof userContract.createUser>['body'];
      signal?: AbortSignal;
    }) => {
      const {
        status,
        body: responseBody,
        headers: responseHeaders,
      } = await userClient.createUser({
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

  updateUserMutationOptions: mutationOptions({
    mutationFn: async ({
      body,
      signal,
    }: {
      body: ClientInferRequest<typeof userContract.updateUser>['body'];
      signal?: AbortSignal;
    }) => {
      const {
        status,
        body: responseBody,
        headers: responseHeaders,
      } = await userClient.updateUser({
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

  deleteUserByIdMutationOptions: mutationOptions({
    mutationFn: async ({
      params,
      signal,
    }: {
      params: ClientInferRequest<typeof userContract.deleteUserById>['params'];
      signal?: AbortSignal;
    }) => {
      const {
        status,
        body: responseBody,
        headers: responseHeaders,
      } = await userClient.deleteUserById({
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
