import type * as v from 'valibot';

import type { response } from '#src/valibot/response-message/response';

import type { NetworkErrorResult } from './network-error';
import { NetworkError } from './network-error';

export interface NetworkErrorWithMessageListResult extends NetworkErrorResult {
  readonly messageList: v.InferOutput<typeof response>['message_list'];
}

/**
 * Extends `NetworkError` with the parsed `message_list` from the response body.
 *
 * Thrown instead of the base `NetworkError` when the response includes a valid
 * JSON envelope that can be parsed against the `response` schema, allowing call
 * sites to surface server-provided error messages to the user.
 */
export class NetworkErrorWithMessageList extends NetworkError implements NetworkErrorWithMessageListResult {
  readonly messageList: NetworkErrorWithMessageListResult['messageList'];

  constructor(data: NetworkErrorWithMessageListResult) {
    super(data);
    this.name = 'NetworkErrorWithMessageList';
    this.messageList = data.messageList;
  }

  /**
   * Returns `true` if `error` is a `NetworkErrorWithMessageList` instance.
   *
   * @param error The value to test.
   * @returns A type predicate narrowing `error` to `NetworkErrorWithMessageList`.
   */
  public static isNetworkErrorWithMessageList(error: unknown): error is NetworkErrorWithMessageList {
    return error instanceof NetworkErrorWithMessageList;
  }
}
