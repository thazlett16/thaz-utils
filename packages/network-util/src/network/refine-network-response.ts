import * as v from 'valibot';

import { response } from '#src/valibot/response-message/response/schema';

import { NetworkError } from './network-error';
import { NetworkErrorWithMessageList } from './network-error-with-message-list';

/**
 * A utility function to refine the response status to the defined success code.
 *
 * If the status code is not the defined success code, then we will parse the response if possible to throw the proper Error type.
 *
 * This is meant as a catch-all function. If we need to handle a separate error code in a different way, then it should be handled before this function.
 *
 * @param statusCode
 * @param successCode
 * @param body
 * @param headers
 * @param defaultMessage
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
