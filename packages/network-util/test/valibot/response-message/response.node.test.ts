import * as v from 'valibot';
import { assert, describe, expect, test } from 'vite-plus/test';

import { response } from '#src/valibot/response-message/response';

describe('response', () => {
  describe('should return dataset without issues', () => {
    test('for a response with an ERROR message', () => {
      const value = {
        message_list: [{ type: 'ERROR', code: 'ERR_001', description: 'Something went wrong' }],
      };
      const result = v.safeParse(response, value);
      assert.isTrue(result.success);
      expect(result.output).toStrictEqual(value);
    });

    test('for a response with multiple messages', () => {
      const value = {
        message_list: [
          { type: 'INFO', code: 'INFO_001', description: 'Processed' },
          { type: 'SUCCESS', code: 'OK_001', description: 'Done' },
        ],
      };
      const result = v.safeParse(response, value);
      assert.isTrue(result.success);
      expect(result.output).toStrictEqual(value);
    });

    test('for a response with null message_list (defaults to empty array)', () => {
      const value = { message_list: null };
      const result = v.safeParse(response, value);
      assert.isTrue(result.success);
      expect(result.output).toStrictEqual({ message_list: [] });
    });

    test('for a response with undefined message_list (defaults to empty array)', () => {
      const value = { message_list: undefined };
      const result = v.safeParse(response, value);
      assert.isTrue(result.success);
      expect(result.output).toStrictEqual({ message_list: [] });
    });

    test('for a response with an empty message_list', () => {
      const value = { message_list: [] };
      const result = v.safeParse(response, value);
      assert.isTrue(result.success);
      expect(result.output).toStrictEqual({ message_list: [] });
    });

    test('for missing message_list field', () => {
      const value = {};
      const result = v.safeParse(response, value);
      assert.isTrue(result.success);
      expect(result.output).toStrictEqual({ message_list: [] });
    });
  });

  describe('should return dataset with issues', () => {
    test('for a message_list with invalid message type', () => {
      const value = {
        message_list: [{ type: 'INVALID', code: 'X', description: 'y' }],
      };
      const result = v.safeParse(response, value);
      expect(result.success).toBeFalsy();
    });

    test('for null', () => {
      const value = null;
      const result = v.safeParse(response, value);
      expect(result.success).toBeFalsy();
    });

    test('for a string', () => {
      const value = 'invalid';
      const result = v.safeParse(response, value);
      expect(result.success).toBeFalsy();
    });
  });
});
