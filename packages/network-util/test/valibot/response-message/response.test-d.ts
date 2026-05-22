import type { InferInput, InferOutput } from 'valibot';
import type * as v from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { message } from '#src/valibot/response-message/message';
import type { response } from '#src/valibot/response-message/response';

describe('response schema', () => {
  describe('should infer correct types', () => {
    test('output has message_list array', () => {
      expectTypeOf<InferOutput<typeof response>>().toEqualTypeOf<{ message_list: v.InferOutput<typeof message>[] }>();
    });

    test('input message_list accepts null and undefined', () => {
      expectTypeOf<InferInput<typeof response>>().toEqualTypeOf<{
        message_list?: v.InferInput<typeof message>[] | null | undefined;
      }>();
    });
  });
});
