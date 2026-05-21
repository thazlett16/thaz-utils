import * as v from 'valibot';

import { response } from '#src/valibot/response-message/response';
import { NetworkErrorWithMessageList } from './network-error-with-message-list';

/**
 * Guards against server-returned ERROR messages embedded in an otherwise successful response.
 *
 * Parses the response body against the `response` schema when the `Content-Type` is JSON. If any
 * message in `message_list` has type `ERROR`, throws a `NetworkErrorWithMessageList` so the caller
 * can surface the server-provided error details. Call this after `refineNetworkError`.
 *
 * @param body The parsed response body.
 * @param statusCode The HTTP status code of the response.
 * @param headers The response `Headers` object — used to check `Content-Type`.
 * @param defaultMessage Optional error message for the thrown error; falls back to `'NetworkErrorWithMessageList'`.
 */
export function checkResponseMessageForError(
  body: unknown,
  statusCode: number,
  headers: Headers,
  defaultMessage?: string,
) {
  const contentTypeHeader = headers.get('content-type');
  const isContentJSON =
    contentTypeHeader === null
      ? false
      : contentTypeHeader.includes('application/') && contentTypeHeader.includes('json');

  if (isContentJSON) {
    const messageList = v.safeParse(response, body);

    if (messageList.success) {
      for (const message of messageList.output.message_list) {
        if (message.type === 'ERROR') {
          throw new NetworkErrorWithMessageList({
            statusCode,
            message: defaultMessage ?? 'NetworkErrorWithMessageList',
            messageList: messageList.output.message_list,
          });
        }
      }
    }
  }
}
