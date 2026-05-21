import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { assert, describe, expect, test } from 'vite-plus/test';

import { activeEntity } from '#src/valibot/entity/active-entity';

const activeAt = Temporal.Instant.from('2024-01-01T00:00:00Z');
const expiredAt = Temporal.Instant.from('2025-01-01T00:00:00Z');

describe('activeEntity', () => {
  describe('should return dataset without issues', () => {
    test('for active with no expiry (null)', () => {
      const value = { active_at_timestamp: activeAt, expired_at_timestamp: null };
      const result = v.safeParse(activeEntity, value);
      assert.isTrue(result.success);
      expect(result.output.active_at_timestamp.equals(activeAt)).toBeTruthy();
      expect(result.output.expired_at_timestamp).toBeNull();
    });

    test('for active with no expiry (undefined defaults to null)', () => {
      const value = { active_at_timestamp: activeAt, expired_at_timestamp: undefined };
      const result = v.safeParse(activeEntity, value);
      assert.isTrue(result.success);
      expect(result.output.active_at_timestamp.equals(activeAt)).toBeTruthy();
      expect(result.output.expired_at_timestamp).toBeNull();
    });

    test('for active with expiry timestamp', () => {
      const value = { active_at_timestamp: activeAt, expired_at_timestamp: expiredAt };
      const result = v.safeParse(activeEntity, value);
      console.info('for active with expiry timestamp - result', result);
      console.info('for active with expiry timestamp - expiredAt', expiredAt);
      assert.isTrue(result.success);
      expect(result.output.active_at_timestamp.equals(value.active_at_timestamp)).toBeTruthy();
      assert.isNotNull(result.output.expired_at_timestamp);
      expect(result.output.expired_at_timestamp.equals(value.expired_at_timestamp)).toBeTruthy();
    });

    test('for active with expiry as ISO string', () => {
      const value = {
        active_at_timestamp: '2024-01-01T00:00:00Z',
        expired_at_timestamp: '2025-01-01T00:00:00Z',
      };
      const result = v.safeParse(activeEntity, value);
      assert.isTrue(result.success);
      expect(result.output.active_at_timestamp.equals(value.active_at_timestamp)).toBeTruthy();
      assert.isNotNull(result.output.expired_at_timestamp);
      expect(result.output.expired_at_timestamp.equals(value.expired_at_timestamp)).toBeTruthy();
    });

    test('for empty object as expired_at_timestamp (converts to null)', () => {
      const value = { active_at_timestamp: activeAt, expired_at_timestamp: {} };
      const result = v.safeParse(activeEntity, value);
      assert.isTrue(result.success);
      expect(result.output.active_at_timestamp.equals(activeAt)).toBeTruthy();
      expect(result.output.expired_at_timestamp).toBeNull();
    });
  });

  describe('should return dataset with issues', () => {
    test('for missing active_at_timestamp', () => {
      const value = { expired_at_timestamp: null };
      const result = v.safeParse(activeEntity, value);
      expect(result.success).toBeFalsy();
    });

    test('for invalid active_at_timestamp string', () => {
      const value = { active_at_timestamp: 'not-a-date', expired_at_timestamp: null };
      const result = v.safeParse(activeEntity, value);
      expect(result.success).toBeFalsy();
    });

    test('for null', () => {
      const value = null;
      const result = v.safeParse(activeEntity, value);
      expect(result.success).toBeFalsy();
    });
  });
});
