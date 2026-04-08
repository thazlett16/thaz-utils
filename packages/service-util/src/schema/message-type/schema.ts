import * as v from 'valibot';

export const MESSAGE_TYPE = {
    INFO: 'INFO',
    SUCCESS: 'SUCCESS',
    WARNING: 'WARNING',
    ERROR: 'ERROR',
} as const;

export type MessageType = (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE];

export const MESSAGE_TYPE_OPTIONS = Object.values(MESSAGE_TYPE) as MessageType[];

export const messageType = v.picklist(MESSAGE_TYPE_OPTIONS);

// type InputMessageType = v.InferInput<typeof messageType>
// type OutputMessageType = v.InferOutput<typeof messageType>
