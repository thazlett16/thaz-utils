import * as v from 'valibot';

import { messageType } from '#src/schema/message-type/schema';

export const message = v.object({
    type: messageType,
    code: v.string(),
    description: v.string(),
});

// type InputMessage = v.InferInput<typeof message>
// type OutputMessage = v.InferOutput<typeof message>
