import { describe, expect, test } from 'vite-plus/test';

import { NetworkError } from '#src/network/network-error';

describe('networkError', () => {
  describe('construction', () => {
    test('sets message', () => {
      const error = new NetworkError({ message: 'oops', statusCode: 404 });
      expect(error.message).toBe('oops');
    });

    test('sets statusCode', () => {
      const error = new NetworkError({ message: 'oops', statusCode: 500 });
      expect(error.statusCode).toBe(500);
    });

    test('sets name to NetworkError', () => {
      const error = new NetworkError({ message: 'oops', statusCode: 404 });
      expect(error.name).toBe('NetworkError');
    });

    test('is an instance of Error', () => {
      const error = new NetworkError({ message: 'oops', statusCode: 404 });
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('isNetworkError', () => {
    test('returns true for NetworkError instances', () => {
      const error = new NetworkError({ message: 'oops', statusCode: 404 });
      expect(NetworkError.isNetworkError(error)).toBeTruthy();
    });

    test('returns false for plain Error', () => {
      expect(NetworkError.isNetworkError(new Error('oops'))).toBeFalsy();
    });

    test('returns false for null', () => {
      expect(NetworkError.isNetworkError(null)).toBeFalsy();
    });

    test('returns false for strings', () => {
      expect(NetworkError.isNetworkError('error')).toBeFalsy();
    });
  });

  describe('status code category getters', () => {
    test('isInformationCode for 1xx', () => {
      expect(new NetworkError({ message: '', statusCode: 100 }).isInformationCode).toBeTruthy();
      expect(new NetworkError({ message: '', statusCode: 199 }).isInformationCode).toBeTruthy();
      expect(new NetworkError({ message: '', statusCode: 200 }).isInformationCode).toBeFalsy();
    });

    test('isSuccessCode for 2xx', () => {
      expect(new NetworkError({ message: '', statusCode: 200 }).isSuccessCode).toBeTruthy();
      expect(new NetworkError({ message: '', statusCode: 299 }).isSuccessCode).toBeTruthy();
      expect(new NetworkError({ message: '', statusCode: 300 }).isSuccessCode).toBeFalsy();
    });

    test('isRedirectCode for 3xx', () => {
      expect(new NetworkError({ message: '', statusCode: 301 }).isRedirectCode).toBeTruthy();
      expect(new NetworkError({ message: '', statusCode: 399 }).isRedirectCode).toBeTruthy();
      expect(new NetworkError({ message: '', statusCode: 400 }).isRedirectCode).toBeFalsy();
    });

    test('isClientCode for 4xx', () => {
      expect(new NetworkError({ message: '', statusCode: 400 }).isClientCode).toBeTruthy();
      expect(new NetworkError({ message: '', statusCode: 499 }).isClientCode).toBeTruthy();
      expect(new NetworkError({ message: '', statusCode: 500 }).isClientCode).toBeFalsy();
    });

    test('isServerCode for 5xx', () => {
      expect(new NetworkError({ message: '', statusCode: 500 }).isServerCode).toBeTruthy();
      expect(new NetworkError({ message: '', statusCode: 599 }).isServerCode).toBeTruthy();
      expect(new NetworkError({ message: '', statusCode: 499 }).isServerCode).toBeFalsy();
    });
  });

  describe('specific status code getters', () => {
    test('isOk for 200', () => {
      expect(new NetworkError({ message: '', statusCode: 200 }).isOk).toBeTruthy();
      expect(new NetworkError({ message: '', statusCode: 201 }).isOk).toBeFalsy();
    });

    test('isCreated for 201', () => {
      expect(new NetworkError({ message: '', statusCode: 201 }).isCreated).toBeTruthy();
      expect(new NetworkError({ message: '', statusCode: 200 }).isCreated).toBeFalsy();
    });

    test('isNoContent for 204', () => {
      expect(new NetworkError({ message: '', statusCode: 204 }).isNoContent).toBeTruthy();
      expect(new NetworkError({ message: '', statusCode: 200 }).isNoContent).toBeFalsy();
    });

    test('isBadRequest for 400', () => {
      expect(new NetworkError({ message: '', statusCode: 400 }).isBadRequest).toBeTruthy();
      expect(new NetworkError({ message: '', statusCode: 401 }).isBadRequest).toBeFalsy();
    });

    test('isUnauthorized for 401', () => {
      expect(new NetworkError({ message: '', statusCode: 401 }).isUnauthorized).toBeTruthy();
      expect(new NetworkError({ message: '', statusCode: 400 }).isUnauthorized).toBeFalsy();
    });

    test('isForbidden for 403', () => {
      expect(new NetworkError({ message: '', statusCode: 403 }).isForbidden).toBeTruthy();
      expect(new NetworkError({ message: '', statusCode: 401 }).isForbidden).toBeFalsy();
    });

    test('isNotFound for 404', () => {
      expect(new NetworkError({ message: '', statusCode: 404 }).isNotFound).toBeTruthy();
      expect(new NetworkError({ message: '', statusCode: 403 }).isNotFound).toBeFalsy();
    });

    test('isInternalServiceError for 500', () => {
      expect(new NetworkError({ message: '', statusCode: 500 }).isInternalServiceError).toBeTruthy();
      expect(new NetworkError({ message: '', statusCode: 501 }).isInternalServiceError).toBeFalsy();
    });

    test('isNotImplemented for 501', () => {
      expect(new NetworkError({ message: '', statusCode: 501 }).isNotImplemented).toBeTruthy();
      expect(new NetworkError({ message: '', statusCode: 500 }).isNotImplemented).toBeFalsy();
    });

    test('isBadGateway for 502', () => {
      expect(new NetworkError({ message: '', statusCode: 502 }).isBadGateway).toBeTruthy();
      expect(new NetworkError({ message: '', statusCode: 500 }).isBadGateway).toBeFalsy();
    });

    test('isServiceUnavailable for 503', () => {
      expect(new NetworkError({ message: '', statusCode: 503 }).isServiceUnavailable).toBeTruthy();
      expect(new NetworkError({ message: '', statusCode: 500 }).isServiceUnavailable).toBeFalsy();
    });

    test('isGatewayTimeout for 504', () => {
      expect(new NetworkError({ message: '', statusCode: 504 }).isGatewayTimeout).toBeTruthy();
      expect(new NetworkError({ message: '', statusCode: 500 }).isGatewayTimeout).toBeFalsy();
    });
  });
});
