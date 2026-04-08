import * as v from 'valibot';

import { responseArray } from '#src/schema/array/schema';
import { message } from '#src/schema/message/schema';

export const response = v.object({
    message_list: responseArray(message),
});

// type InputResponse = v.InferInput<typeof response>
// type OutputResponse = v.InferOutput<typeof response>
