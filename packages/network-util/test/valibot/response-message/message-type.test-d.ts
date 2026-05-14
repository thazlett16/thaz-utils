import type { InferInput, InferOutput } from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { MessageType, messageType } from '#src/valibot/response-message/message-type';
import { MESSAGE_TYPE } from '#src/valibot/response-message/message-type';

describe('messageType', () => {
  test('is a union of the four message type strings', () => {
    expectTypeOf<MessageType>().toEqualTypeOf<'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'>();
  });
});

describe('MESSAGE_TYPE', () => {
  test('values are readonly string literals', () => {
    expectTypeOf(MESSAGE_TYPE.INFO).toEqualTypeOf<'INFO'>();
    expectTypeOf(MESSAGE_TYPE.SUCCESS).toEqualTypeOf<'SUCCESS'>();
    expectTypeOf(MESSAGE_TYPE.WARNING).toEqualTypeOf<'WARNING'>();
    expectTypeOf(MESSAGE_TYPE.ERROR).toEqualTypeOf<'ERROR'>();
  });
});

describe('messageType schema', () => {
  test('input is MessageType', () => {
    expectTypeOf<InferInput<typeof messageType>>().toEqualTypeOf<MessageType>();
  });

  test('output is MessageType', () => {
    expectTypeOf<InferOutput<typeof messageType>>().toEqualTypeOf<MessageType>();
  });
});
