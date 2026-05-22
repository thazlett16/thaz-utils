import type { InferInput, InferOutput } from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { message } from '#src/valibot/response-message/message';
import type { MessageType } from '#src/valibot/response-message/message-type';

describe('message schema', () => {
  describe('should infer correct types', () => {
    test('input has type, code, and description', () => {
      expectTypeOf<InferInput<typeof message>>().toEqualTypeOf<{
        type: MessageType;
        code: string;
        description: string;
      }>();
    });

    test('output has type, code, and description', () => {
      expectTypeOf<InferOutput<typeof message>>().toEqualTypeOf<{
        type: MessageType;
        code: string;
        description: string;
      }>();
    });
  });
});
