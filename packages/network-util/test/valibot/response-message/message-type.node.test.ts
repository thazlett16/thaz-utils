import * as v from 'valibot';
import { assert, describe, expect, test } from 'vite-plus/test';

import { MESSAGE_TYPE, MESSAGE_TYPE_OPTIONS, messageType } from '#src/valibot/response-message/message-type';

describe('MESSAGE_TYPE', () => {
  test('has expected keys and values', () => {
    expect(MESSAGE_TYPE).toStrictEqual({
      INFO: 'INFO',
      SUCCESS: 'SUCCESS',
      WARNING: 'WARNING',
      ERROR: 'ERROR',
    });
  });
});

describe('MESSAGE_TYPE_OPTIONS', () => {
  test('contains all message type values', () => {
    expect(MESSAGE_TYPE_OPTIONS).toContain('INFO');
    expect(MESSAGE_TYPE_OPTIONS).toContain('SUCCESS');
    expect(MESSAGE_TYPE_OPTIONS).toContain('WARNING');
    expect(MESSAGE_TYPE_OPTIONS).toContain('ERROR');
  });

  test('has exactly 4 items', () => {
    expect(MESSAGE_TYPE_OPTIONS).toHaveLength(4);
  });
});

describe('messageType', () => {
  describe('should return dataset without issues', () => {
    test('for INFO', () => {
      const value = 'INFO';
      const result = v.safeParse(messageType, value);
      assert.isTrue(result.success);
      expect(result.output).toBe('INFO');
    });

    test('for SUCCESS', () => {
      const value = 'SUCCESS';
      const result = v.safeParse(messageType, value);
      assert.isTrue(result.success);
      expect(result.output).toBe('SUCCESS');
    });

    test('for WARNING', () => {
      const value = 'WARNING';
      const result = v.safeParse(messageType, value);
      assert.isTrue(result.success);
      expect(result.output).toBe('WARNING');
    });

    test('for ERROR', () => {
      const value = 'ERROR';
      const result = v.safeParse(messageType, value);
      assert.isTrue(result.success);
      expect(result.output).toBe('ERROR');
    });
  });

  describe('should return dataset with issues', () => {
    test('for lowercase info', () => {
      const value = 'info';
      const result = v.safeParse(messageType, value);
      expect(result.success).toBeFalsy();
    });

    test('for lowercase error', () => {
      const value = 'error';
      const result = v.safeParse(messageType, value);
      expect(result.success).toBeFalsy();
    });

    test('for arbitrary strings', () => {
      const value = 'UNKNOWN';
      const result = v.safeParse(messageType, value);
      expect(result.success).toBeFalsy();
    });

    test('for null', () => {
      const value = null;
      const result = v.safeParse(messageType, value);
      expect(result.success).toBeFalsy();
    });

    test('for undefined', () => {
      const value = undefined;
      const result = v.safeParse(messageType, value);
      expect(result.success).toBeFalsy();
    });

    test('for numbers', () => {
      const value = 1;
      const result = v.safeParse(messageType, value);
      expect(result.success).toBeFalsy();
    });
  });
});
