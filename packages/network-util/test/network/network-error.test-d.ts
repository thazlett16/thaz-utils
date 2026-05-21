import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { NetworkErrorConstructor } from '#src/network/network-error';
import { NetworkError } from '#src/network/network-error';

describe('networkError', () => {
  describe('constructor type', () => {
    test('requires message and statusCode', () => {
      expectTypeOf<NetworkErrorConstructor>().toMatchTypeOf<{ message: string; statusCode: number }>();
    });
  });

  describe('instance types', () => {
    const error = new NetworkError({ message: 'oops', statusCode: 404 });

    test('statusCode is readonly number', () => {
      expectTypeOf(error.statusCode).toEqualTypeOf<number>();
    });

    test('isNetworkError is a type guard', () => {
      const unknown: unknown = error;
      if (NetworkError.isNetworkError(unknown)) {
        expectTypeOf(unknown).toEqualTypeOf<NetworkError>();
      }
    });

    test('status category getters are boolean', () => {
      expectTypeOf(error.isInformationCode).toEqualTypeOf<boolean>();
      expectTypeOf(error.isSuccessCode).toEqualTypeOf<boolean>();
      expectTypeOf(error.isRedirectCode).toEqualTypeOf<boolean>();
      expectTypeOf(error.isClientCode).toEqualTypeOf<boolean>();
      expectTypeOf(error.isServerCode).toEqualTypeOf<boolean>();
    });

    test('specific status getters are boolean', () => {
      expectTypeOf(error.isOk).toEqualTypeOf<boolean>();
      expectTypeOf(error.isCreated).toEqualTypeOf<boolean>();
      expectTypeOf(error.isNoContent).toEqualTypeOf<boolean>();
      expectTypeOf(error.isBadRequest).toEqualTypeOf<boolean>();
      expectTypeOf(error.isUnauthorized).toEqualTypeOf<boolean>();
      expectTypeOf(error.isForbidden).toEqualTypeOf<boolean>();
      expectTypeOf(error.isNotFound).toEqualTypeOf<boolean>();
      expectTypeOf(error.isInternalServiceError).toEqualTypeOf<boolean>();
      expectTypeOf(error.isNotImplemented).toEqualTypeOf<boolean>();
      expectTypeOf(error.isBadGateway).toEqualTypeOf<boolean>();
      expectTypeOf(error.isServiceUnavailable).toEqualTypeOf<boolean>();
      expectTypeOf(error.isGatewayTimeout).toEqualTypeOf<boolean>();
    });
  });
});
