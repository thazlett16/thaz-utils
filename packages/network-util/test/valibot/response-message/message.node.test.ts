import * as v from 'valibot';
import { assert, describe, expect, test } from 'vite-plus/test';

import { message } from '#src/valibot/response-message/message';

describe('message', () => {
  describe('should return dataset without issues', () => {
    test('for an INFO message', () => {
      const value = { type: 'INFO', code: 'INFO_001', description: 'Informational' };
      const result = v.safeParse(message, value);
      assert.isTrue(result.success);
      expect(result.output).toStrictEqual(value);
    });

    test('for a SUCCESS message', () => {
      const value = { type: 'SUCCESS', code: 'OK_001', description: 'Created successfully' };
      const result = v.safeParse(message, value);
      assert.isTrue(result.success);
      expect(result.output).toStrictEqual(value);
    });

    test('for a WARNING message', () => {
      const value = { type: 'WARNING', code: 'WARN_001', description: 'Deprecated field used' };
      const result = v.safeParse(message, value);
      assert.isTrue(result.success);
      expect(result.output).toStrictEqual(value);
    });

    test('for an ERROR message', () => {
      const value = { type: 'ERROR', code: 'ERR_001', description: 'Something went wrong' };
      const result = v.safeParse(message, value);
      assert.isTrue(result.success);
      expect(result.output).toStrictEqual(value);
    });
  });

  describe('should return dataset with issues', () => {
    test('for missing type', () => {
      const value = { code: 'ERR_001', description: 'oops' };
      const result = v.safeParse(message, value);
      expect(result.success).toBeFalsy();
    });

    test('for invalid type value', () => {
      const value = { type: 'UNKNOWN', code: 'X', description: 'y' };
      const result = v.safeParse(message, value);
      expect(result.success).toBeFalsy();
    });

    test('for missing code', () => {
      const value = { type: 'ERROR', description: 'oops' };
      const result = v.safeParse(message, value);
      expect(result.success).toBeFalsy();
    });

    test('for missing description', () => {
      const value = { type: 'ERROR', code: 'ERR_001' };
      const result = v.safeParse(message, value);
      expect(result.success).toBeFalsy();
    });

    test('for null', () => {
      const value = null;
      const result = v.safeParse(message, value);
      expect(result.success).toBeFalsy();
    });

    test('for an array', () => {
      const value: unknown[] = [];
      const result = v.safeParse(message, value);
      expect(result.success).toBeFalsy();
    });
  });
});
