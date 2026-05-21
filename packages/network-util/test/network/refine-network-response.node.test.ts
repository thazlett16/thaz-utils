import { describe, expect, test } from 'vite-plus/test';

import { NetworkError } from '#src/network/network-error';
import { NetworkErrorWithMessageList } from '#src/network/network-error-with-message-list';
import { refineNetworkError } from '#src/network/refine-network-response';

function makeHeaders(contentType: string | null) {
  const headers = new Headers();
  if (contentType !== null) {
    headers.set('content-type', contentType);
  }
  return headers;
}

const responseBody = {
  message_list: [{ type: 'ERROR', code: 'ERR_001', description: 'Not found' }],
};

describe('refineNetworkError', () => {
  describe('when status matches success code', () => {
    test('does not throw', () => {
      expect(() => {
        refineNetworkError(200, 200, {}, makeHeaders(null));
      }).not.toThrow();
    });

    test('does not throw for 201', () => {
      expect(() => {
        refineNetworkError(201, 201, {}, makeHeaders(null));
      }).not.toThrow();
    });

    test('does not throw even with error body when status matches', () => {
      expect(() => {
        refineNetworkError(200, 200, responseBody, makeHeaders('application/json'));
      }).not.toThrow();
    });
  });

  describe('when status does not match success code', () => {
    describe('with non-JSON content type', () => {
      test('throws NetworkError for non-json response', () => {
        const headers = makeHeaders('text/plain');
        expect(() => {
          refineNetworkError(404, 200, 'not found', headers);
        }).toThrow(NetworkError);
      });

      test('throws NetworkError when content-type is absent', () => {
        expect(() => {
          refineNetworkError(500, 200, null, makeHeaders(null));
        }).toThrow(NetworkError);
      });

      test('thrown NetworkError has correct statusCode', () => {
        try {
          refineNetworkError(404, 200, null, makeHeaders(null));
        } catch (error) {
          if (NetworkError.isNetworkError(error)) {
            expect(error.statusCode).toBe(404);
          }
        }
      });
    });

    describe('with JSON content type and parseable body', () => {
      const jsonHeaders = makeHeaders('application/json');

      test('throws NetworkErrorWithMessageList', () => {
        expect(() => {
          refineNetworkError(400, 200, responseBody, jsonHeaders);
        }).toThrow(NetworkErrorWithMessageList);
      });

      test('thrown error has correct statusCode', () => {
        try {
          refineNetworkError(422, 200, responseBody, jsonHeaders);
        } catch (error) {
          if (NetworkErrorWithMessageList.isNetworkErrorWithMessageList(error)) {
            expect(error.statusCode).toBe(422);
          }
        }
      });

      test('thrown error contains the message list', () => {
        try {
          refineNetworkError(400, 200, responseBody, jsonHeaders);
        } catch (error) {
          if (NetworkErrorWithMessageList.isNetworkErrorWithMessageList(error)) {
            expect(error.messageList).toStrictEqual(responseBody.message_list);
          }
        }
      });

      test('uses defaultMessage when provided', () => {
        try {
          refineNetworkError(400, 200, responseBody, jsonHeaders, 'custom error');
        } catch (error) {
          if (NetworkErrorWithMessageList.isNetworkErrorWithMessageList(error)) {
            expect(error.message).toBe('custom error');
          }
        }
      });

      test('uses default message when not provided', () => {
        try {
          refineNetworkError(400, 200, responseBody, jsonHeaders);
        } catch (error) {
          if (NetworkErrorWithMessageList.isNetworkErrorWithMessageList(error)) {
            expect(error.message).toBe('NetworkErrorWithMessageList');
          }
        }
      });
    });

    describe('with JSON content type but unparseable body', () => {
      test('falls back to NetworkError when body does not match response schema', () => {
        const jsonHeaders = makeHeaders('application/json');
        const badBody = { unrelated: 'data' };
        expect(() => {
          refineNetworkError(400, 200, badBody, jsonHeaders);
        }).toThrow(NetworkError);
        expect(() => {
          refineNetworkError(400, 200, badBody, jsonHeaders);
        }).not.toThrow(NetworkErrorWithMessageList);
      });
    });
  });
});
