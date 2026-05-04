import * as v from 'valibot';

import { message } from '#src/valibot/response-message/message/message';
import { responseArray } from '#src/valibot/schema/array/array';

export const response = v.object({
  message_list: responseArray(message),
});

// type InputResponse = v.InferInput<typeof response>
// type OutputResponse = v.InferOutput<typeof response>
