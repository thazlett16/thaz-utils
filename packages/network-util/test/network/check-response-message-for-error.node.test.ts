import { assert, describe, expect, test } from 'vite-plus/test';

import { checkResponseMessageForError } from '#src/network/check-response-message-for-error';
import { NetworkErrorWithMessageList } from '#src/network/network-error-with-message-list';

function makeHeaders(contentType: string | null) {
  const headers = new Headers();
  if (contentType !== null) {
    headers.set('content-type', contentType);
  }
  return headers;
}

const errorBody = {
  message_list: [{ type: 'ERROR', code: 'ERR_001', description: 'Something went wrong' }],
};

const successBody = {
  message_list: [{ type: 'SUCCESS', code: 'OK_001', description: 'All good' }],
};

const mixedBody = {
  message_list: [
    { type: 'INFO', code: 'INFO_001', description: 'Info' },
    { type: 'ERROR', code: 'ERR_001', description: 'Failed' },
  ],
};

describe('checkResponseMessageForError', () => {
  describe('when content-type is not JSON', () => {
    test('does not throw for non-json content type', () => {
      const headers = makeHeaders('text/plain');
      expect(() => {
        checkResponseMessageForError(errorBody, 200, headers);
      }).not.toThrow();
    });

    test('does not throw when content-type header is absent', () => {
      const headers = makeHeaders(null);
      expect(() => {
        checkResponseMessageForError(errorBody, 200, headers);
      }).not.toThrow();
    });

    test('does not throw for text/html content type', () => {
      const headers = makeHeaders('text/html; charset=utf-8');
      expect(() => {
        checkResponseMessageForError(errorBody, 200, headers);
      }).not.toThrow();
    });
  });

  describe('when content-type is JSON', () => {
    const jsonHeaders = makeHeaders('application/json');

    test('does not throw when body has only SUCCESS messages', () => {
      expect(() => {
        checkResponseMessageForError(successBody, 200, jsonHeaders);
      }).not.toThrow();
    });

    test('does not throw when body has no messages', () => {
      expect(() => {
        checkResponseMessageForError({ message_list: [] }, 200, jsonHeaders);
      }).not.toThrow();
    });

    test('throws NetworkErrorWithMessageList when body has ERROR message', () => {
      expect(() => {
        checkResponseMessageForError(errorBody, 200, jsonHeaders);
      }).toThrow(NetworkErrorWithMessageList);
    });

    test('throws NetworkErrorWithMessageList when mixed messages include ERROR', () => {
      expect(() => {
        checkResponseMessageForError(mixedBody, 200, jsonHeaders);
      }).toThrow(NetworkErrorWithMessageList);
    });

    test('thrown error contains the full message list', () => {
      let caughtError: unknown;
      try {
        checkResponseMessageForError(errorBody, 200, jsonHeaders);
      } catch (error) {
        caughtError = error;
      }
      assert.instanceOf(caughtError, NetworkErrorWithMessageList);
      expect(caughtError.messageList).toStrictEqual(errorBody.message_list);
    });

    test('uses defaultMessage when provided', () => {
      let caughtError: unknown;
      try {
        checkResponseMessageForError(errorBody, 200, jsonHeaders, 'custom message');
      } catch (error) {
        caughtError = error;
      }
      assert.instanceOf(caughtError, NetworkErrorWithMessageList);
      expect(caughtError.message).toBe('custom message');
    });

    test('uses default message when not provided', () => {
      let caughtError: unknown;
      try {
        checkResponseMessageForError(errorBody, 200, jsonHeaders);
      } catch (error) {
        caughtError = error;
      }
      assert.instanceOf(caughtError, NetworkErrorWithMessageList);
      expect(caughtError.message).toBe('NetworkErrorWithMessageList');
    });

    test('passes statusCode to the thrown error', () => {
      let caughtError: unknown;
      try {
        checkResponseMessageForError(errorBody, 200, jsonHeaders);
      } catch (error) {
        caughtError = error;
      }
      assert.instanceOf(caughtError, NetworkErrorWithMessageList);
      expect(caughtError.statusCode).toBe(200);
    });

    test('does not throw when body does not match response schema', () => {
      const badBody = { not_message_list: 'invalid' };

      expect(() => {
        checkResponseMessageForError(badBody, 200, jsonHeaders);
      }).not.toThrow();
    });

    test('does not throw when message_list fails schema validation', () => {
      const badBody = { message_list: 'not-an-array' };
      expect(() => {
        checkResponseMessageForError(badBody, 200, jsonHeaders);
      }).not.toThrow();
    });

    test('handles application/json;charset=utf-8 content type', () => {
      const headers = makeHeaders('application/json;charset=utf-8');
      expect(() => {
        checkResponseMessageForError(errorBody, 200, headers);
      }).toThrow(NetworkErrorWithMessageList);
    });
  });
});
