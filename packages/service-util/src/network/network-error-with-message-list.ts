import type * as v from 'valibot';

import type { response } from '#src/schema/response/schema';

import type { NetworkErrorConstructor } from './network-error';

import { NetworkError } from './network-error';

export interface NetworkErrorWithMessageListConstructor extends NetworkErrorConstructor {
    readonly messageList: v.InferOutput<typeof response>['message_list'];
}

export class NetworkErrorWithMessageList extends NetworkError {
    readonly messageList: NetworkErrorWithMessageListConstructor['messageList'];

    constructor(data: NetworkErrorWithMessageListConstructor) {
        super(data);
        this.name = 'NetworkErrorWithMessageList';
        this.messageList = data.messageList;
    }

    public static isNetworkErrorWithMessageList(error: unknown): error is NetworkErrorWithMessageList {
        return error instanceof NetworkErrorWithMessageList;
    }
}
