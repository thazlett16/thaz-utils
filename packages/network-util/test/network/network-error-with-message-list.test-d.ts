import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { NetworkError } from '#src/network/network-error';
import type { NetworkErrorWithMessageListConstructor } from '#src/network/network-error-with-message-list';
import { NetworkErrorWithMessageList } from '#src/network/network-error-with-message-list';

describe('networkErrorWithMessageList', () => {
  describe('constructor type', () => {
    test('extends NetworkErrorConstructor with messageList', () => {
      expectTypeOf<NetworkErrorWithMessageListConstructor>().toMatchTypeOf<{
        message: string;
        statusCode: number;
        messageList: readonly { type: string; code: string; description: string }[];
      }>();
    });
  });

  describe('instance types', () => {
    const error = new NetworkErrorWithMessageList({
      message: 'oops',
      statusCode: 400,
      messageList: [],
    });

    test('is assignable to NetworkError', () => {
      expectTypeOf(error).toMatchTypeOf<NetworkError>();
    });

    test('messageList is readonly array', () => {
      expectTypeOf(error.messageList).toMatchTypeOf<readonly unknown[]>();
    });

    test('isNetworkErrorWithMessageList is a type guard', () => {
      const unknown: unknown = error;
      if (NetworkErrorWithMessageList.isNetworkErrorWithMessageList(unknown)) {
        expectTypeOf(unknown).toEqualTypeOf<NetworkErrorWithMessageList>();
      }
    });
  });
});
