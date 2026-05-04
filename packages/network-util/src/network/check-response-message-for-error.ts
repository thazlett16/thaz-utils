import * as v from 'valibot';

import { response } from '#src/valibot/response-message/response/response';

import { NetworkErrorWithMessageList } from './network-error-with-message-list';

/**
 * We should never return an error messages in a success response. But this helps to guard in that case.
 *
 * Should use this after the refineNetworkResponse utility.
 *
 * @param body
 * @param statusCode
 * @param headers
 * @param defaultMessage
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
