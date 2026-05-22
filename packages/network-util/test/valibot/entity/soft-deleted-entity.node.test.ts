import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { assert, describe, expect, test } from 'vite-plus/test';

import { softDeletedEntity } from '#src/valibot/entity/soft-deleted-entity';

describe('softDeletedEntity', () => {
  describe('should return dataset without issues', () => {
    test('for a non-deleted entity (null)', () => {
      const value = { soft_deleted_at_timestamp: null };
      const result = v.safeParse(softDeletedEntity, value);
      assert.isTrue(result.success);
      expect(result.output.soft_deleted_at_timestamp).toBeNull();
    });

    test('for a non-deleted entity (undefined defaults to null)', () => {
      const value = { soft_deleted_at_timestamp: undefined };
      const result = v.safeParse(softDeletedEntity, value);
      assert.isTrue(result.success);
      expect(result.output.soft_deleted_at_timestamp).toBeNull();
    });

    test('for a soft-deleted entity with Temporal.Instant', () => {
      const value = { soft_deleted_at_timestamp: Temporal.Instant.from('2024-06-15T12:00:00Z') };
      const result = v.safeParse(softDeletedEntity, value);
      assert.isTrue(result.success);
      console.info('result', result);
      assert.isNotNull(result.output.soft_deleted_at_timestamp);
      expect(result.output.soft_deleted_at_timestamp.equals(value.soft_deleted_at_timestamp)).toBeTruthy();
    });

    test('for a soft-deleted entity with ISO string', () => {
      const value = { soft_deleted_at_timestamp: '2024-06-15T12:00:00Z' };
      const result = v.safeParse(softDeletedEntity, value);
      assert.isTrue(result.success);
      assert.isNotNull(result.output.soft_deleted_at_timestamp);
      expect(result.output.soft_deleted_at_timestamp.equals(value.soft_deleted_at_timestamp)).toBeTruthy();
    });

    test('for empty object {} as value (converts to null)', () => {
      const value = { soft_deleted_at_timestamp: {} };
      const result = v.safeParse(softDeletedEntity, value);
      assert.isTrue(result.success);
      expect(result.output.soft_deleted_at_timestamp).toBeNull();
    });

    test('for missing soft_deleted_at_timestamp field', () => {
      const value = {};
      const result = v.safeParse(softDeletedEntity, value);
      assert.isTrue(result.success);
      expect(result.output.soft_deleted_at_timestamp).toBeNull();
    });
  });

  describe('should return dataset with issues', () => {
    test('for invalid timestamp string', () => {
      const value = { soft_deleted_at_timestamp: 'not-a-date' };
      const result = v.safeParse(softDeletedEntity, value);
      expect(result.success).toBeFalsy();
    });

    test('for null input', () => {
      const value = null;
      const result = v.safeParse(softDeletedEntity, value);
      expect(result.success).toBeFalsy();
    });
  });
});
