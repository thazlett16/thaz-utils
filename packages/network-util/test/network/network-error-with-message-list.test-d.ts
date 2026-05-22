import { describe, expectTypeOf, test } from 'vite-plus/test';

import { NetworkErrorWithMessageList } from '#src/network/network-error-with-message-list';
import type { MessageType } from '#src/valibot/response-message/message-type';

describe('networkErrorWithMessageList', () => {
  describe('instance types', () => {
    const error = new NetworkErrorWithMessageList({
      message: 'oops',
      statusCode: 400,
      messageList: [],
    });

    test('is assignable to NetworkError', () => {
      expectTypeOf(error).toEqualTypeOf<NetworkErrorWithMessageList>();
    });

    test('messageList is readonly array', () => {
      expectTypeOf(error.messageList).toEqualTypeOf<{ code: string; description: string; type: MessageType }[]>();
    });

    test('isNetworkErrorWithMessageList is a type guard', () => {
      type IsTypeGuard = typeof NetworkErrorWithMessageList.isNetworkErrorWithMessageList extends ((
        x: unknown,
      ) => x is NetworkErrorWithMessageList)
        ? true
        : false;
      expectTypeOf<IsTypeGuard>().toEqualTypeOf<true>();
    });
  });
});
