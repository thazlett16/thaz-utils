import { describe, expect, test } from 'vite-plus/test';

import { NetworkError } from '#src/network/network-error';
import { NetworkErrorWithMessageList } from '#src/network/network-error-with-message-list';

const messageList = [
  { type: 'ERROR' as const, code: 'ERR_001', description: 'Something went wrong' },
  { type: 'INFO' as const, code: 'INFO_001', description: 'Additional info' },
];

describe('networkErrorWithMessageList', () => {
  describe('construction', () => {
    test('sets message', () => {
      const error = new NetworkErrorWithMessageList({ message: 'oops', statusCode: 400, messageList });
      expect(error.message).toBe('oops');
    });

    test('sets statusCode', () => {
      const error = new NetworkErrorWithMessageList({ message: 'oops', statusCode: 422, messageList });
      expect(error.statusCode).toBe(422);
    });

    test('sets messageList', () => {
      const error = new NetworkErrorWithMessageList({ message: 'oops', statusCode: 400, messageList });
      expect(error.messageList).toBe(messageList);
    });

    test('sets name to NetworkErrorWithMessageList', () => {
      const error = new NetworkErrorWithMessageList({ message: 'oops', statusCode: 400, messageList });
      expect(error.name).toBe('NetworkErrorWithMessageList');
    });

    test('is an instance of NetworkError', () => {
      const error = new NetworkErrorWithMessageList({ message: 'oops', statusCode: 400, messageList });
      expect(error).toBeInstanceOf(NetworkError);
    });

    test('is an instance of Error', () => {
      const error = new NetworkErrorWithMessageList({ message: 'oops', statusCode: 400, messageList });
      expect(error).toBeInstanceOf(Error);
    });

    test('accepts empty messageList', () => {
      const error = new NetworkErrorWithMessageList({ message: 'oops', statusCode: 400, messageList: [] });
      expect(error.messageList).toStrictEqual([]);
    });
  });

  describe('isNetworkErrorWithMessageList', () => {
    test('returns true for NetworkErrorWithMessageList instances', () => {
      const error = new NetworkErrorWithMessageList({ message: 'oops', statusCode: 400, messageList });
      expect(NetworkErrorWithMessageList.isNetworkErrorWithMessageList(error)).toBeTruthy();
    });

    test('returns false for plain NetworkError', () => {
      const error = new NetworkError({ message: 'oops', statusCode: 400 });
      expect(NetworkErrorWithMessageList.isNetworkErrorWithMessageList(error)).toBeFalsy();
    });

    test('returns false for plain Error', () => {
      expect(NetworkErrorWithMessageList.isNetworkErrorWithMessageList(new Error('oops'))).toBeFalsy();
    });

    test('returns false for null', () => {
      expect(NetworkErrorWithMessageList.isNetworkErrorWithMessageList(null)).toBeFalsy();
    });
  });

  describe('inherits NetworkError getters', () => {
    test('isClientCode is true for 4xx', () => {
      const error = new NetworkErrorWithMessageList({ message: 'oops', statusCode: 422, messageList });
      expect(error.isClientCode).toBeTruthy();
    });

    test('isServerCode is true for 5xx', () => {
      const error = new NetworkErrorWithMessageList({ message: 'oops', statusCode: 500, messageList });
      expect(error.isServerCode).toBeTruthy();
    });
  });
});
