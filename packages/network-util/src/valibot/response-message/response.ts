import * as v from 'valibot';

import { responseArray } from '#src/valibot/schema/array';

import { message } from './message';

export const response = v.object({
  message_list: responseArray(message),
});

// type InputResponse = v.InferInput<typeof response>
// type OutputResponse = v.InferOutput<typeof response>
