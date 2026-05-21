import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { assert, describe, expect, test } from 'vite-plus/test';

import { baseEntity } from '#src/valibot/entity/base-entity';

const validBase = {
  created_at_timestamp: Temporal.Instant.from('2024-01-01T00:00:00Z'),
  created_by: 'user-1',
  updated_at_timestamp: Temporal.Instant.from('2024-06-15T12:00:00Z'),
  updated_by: 'user-2',
};

describe('baseEntity', () => {
  describe('should return dataset without issues', () => {
    test('for Temporal.Instant timestamp values', () => {
      const value = validBase;
      const result = v.safeParse(baseEntity, value);
      assert(result.success);
      expect(result.output.created_at_timestamp).toBeInstanceOf(Temporal.Instant);
      expect(result.output.updated_at_timestamp).toBeInstanceOf(Temporal.Instant);
      expect(result.output.created_by).toBe('user-1');
      expect(result.output.updated_by).toBe('user-2');
    });

    test('for ISO string timestamp values', () => {
      const value = {
        created_at_timestamp: '2024-01-01T00:00:00Z',
        created_by: 'user-1',
        updated_at_timestamp: '2024-06-15T12:00:00Z',
        updated_by: 'user-2',
      };
      const result = v.safeParse(baseEntity, value);
      assert(result.success);
      expect(result.output.created_at_timestamp).toBeInstanceOf(Temporal.Instant);
      expect(result.output.updated_at_timestamp).toBeInstanceOf(Temporal.Instant);
    });
  });

  describe('should return dataset with issues', () => {
    test('for missing created_at_timestamp', () => {
      const { created_at_timestamp: _, ...value } = validBase;
      const result = v.safeParse(baseEntity, value);
      expect(result.success).toBeFalsy();
    });

    test('for missing created_by', () => {
      const { created_by: _, ...value } = validBase;
      const result = v.safeParse(baseEntity, value);
      expect(result.success).toBeFalsy();
    });

    test('for missing updated_at_timestamp', () => {
      const { updated_at_timestamp: _, ...value } = validBase;
      const result = v.safeParse(baseEntity, value);
      expect(result.success).toBeFalsy();
    });

    test('for missing updated_by', () => {
      const { updated_by: _, ...value } = validBase;
      const result = v.safeParse(baseEntity, value);
      expect(result.success).toBeFalsy();
    });

    test('for invalid timestamp string', () => {
      const value = { ...validBase, created_at_timestamp: 'not-a-date' };
      const result = v.safeParse(baseEntity, value);
      expect(result.success).toBeFalsy();
    });

    test('for null', () => {
      const value = null;
      const result = v.safeParse(baseEntity, value);
      expect(result.success).toBeFalsy();
    });
  });
});
