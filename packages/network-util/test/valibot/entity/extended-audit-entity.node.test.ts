import * as v from 'valibot';
import { assert, describe, expect, test } from 'vite-plus/test';

import { extendedAuditEntity } from '#src/valibot/entity/extended-audit-entity';

const validEntity = {
  created_by_process: 'import-job',
  created_by_user_id: 'user-123',
  updated_by_process: 'sync-job',
  updated_by_user_id: 'user-456',
};

describe('extendedAuditEntity', () => {
  describe('should return dataset without issues', () => {
    test('for an entity with all string values', () => {
      const value = validEntity;
      const result = v.safeParse(extendedAuditEntity, value);
      assert.isTrue(result.success);
      expect(result.output).toStrictEqual(validEntity);
    });

    test('for an entity with all null values', () => {
      const value = {
        created_by_process: null,
        created_by_user_id: null,
        updated_by_process: null,
        updated_by_user_id: null,
      };
      const result = v.safeParse(extendedAuditEntity, value);
      assert.isTrue(result.success);
      expect(result.output).toStrictEqual(value);
    });

    test('for an entity with undefined values (defaults to null)', () => {
      const value = {
        created_by_process: undefined,
        created_by_user_id: undefined,
        updated_by_process: undefined,
        updated_by_user_id: undefined,
      };
      const result = v.safeParse(extendedAuditEntity, value);
      assert.isTrue(result.success);
      expect(result.output.created_by_process).toBeNull();
      expect(result.output.created_by_user_id).toBeNull();
      expect(result.output.updated_by_process).toBeNull();
      expect(result.output.updated_by_user_id).toBeNull();
    });

    test('for a mixed entity', () => {
      const value = {
        created_by_process: 'import-job',
        created_by_user_id: null,
        updated_by_process: null,
        updated_by_user_id: 'user-456',
      };
      const result = v.safeParse(extendedAuditEntity, value);
      assert.isTrue(result.success);
      expect(result.output.created_by_process).toBe('import-job');
      expect(result.output.created_by_user_id).toBeNull();
    });

    test('for empty object {} as value (converts to null)', () => {
      const value = {
        created_by_process: {},
        created_by_user_id: null,
        updated_by_process: null,
        updated_by_user_id: null,
      };
      const result = v.safeParse(extendedAuditEntity, value);
      assert.isTrue(result.success);
      expect(result.output.created_by_process).toBeNull();
    });
  });

  describe('should return dataset with issues', () => {
    test('for null', () => {
      const value = null;
      const result = v.safeParse(extendedAuditEntity, value);
      expect(result.success).toBeFalsy();
    });

    test('for number values', () => {
      const value = { ...validEntity, created_by_process: 42 };
      const result = v.safeParse(extendedAuditEntity, value);
      expect(result.success).toBeFalsy();
    });
  });
});
