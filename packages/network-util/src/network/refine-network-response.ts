import * as v from 'valibot';

import { response } from '#src/valibot/response-message/response';
import { NetworkError } from './network-error';
import { NetworkErrorWithMessageList } from './network-error-with-message-list';

/**
 * Asserts that `statusCode` equals `successCode`, throwing the appropriate error type if not.
 *
 * When the status does not match, attempts to parse the body against the `response` schema.
 * A successful parse produces a `NetworkErrorWithMessageList`; a failed parse falls back to a
 * plain `NetworkError`. Intended as a catch-all — handle any status codes that need special
 * treatment before calling this function.
 *
 * @param statusCode The HTTP status code returned by the server.
 * @param successCode The expected success status code.
 * @param body The parsed response body.
 * @param headers The response `Headers` object — used to check `Content-Type`.
 * @param defaultMessage Optional error message for the thrown error; falls back to the error class name.
 */
export function refineNetworkError<T extends number>(
  statusCode: number,
  successCode: T,
  body: unknown,
  headers: Headers,
  defaultMessage?: string,
): asserts statusCode is T {
  const contentTypeHeader = headers.get('content-type');
  const isContentJSON =
    contentTypeHeader === null
      ? false
      : contentTypeHeader.includes('application/') && contentTypeHeader.includes('json');

  if (statusCode !== successCode) {
    if (isContentJSON) {
      const messageList = v.safeParse(response, body);

      if (messageList.success) {
        throw new NetworkErrorWithMessageList({
          statusCode,
          message: defaultMessage ?? 'NetworkErrorWithMessageList',
          messageList: messageList.output.message_list,
        });
      }
    }

    throw new NetworkError({
      statusCode,
      message: defaultMessage ?? 'NetworkError',
    });
  }
}
