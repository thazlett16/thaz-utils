import * as v from 'valibot';
import { assert, describe, expect, test } from 'vite-plus/test';

import { responseArray } from '#src/valibot/schema/array';

describe('responseArray', () => {
  const schema = responseArray(v.string());

  describe('should return dataset without issues', () => {
    test('for an array of valid items', () => {
      const value = ['a', 'b', 'c'];
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toStrictEqual(['a', 'b', 'c']);
    });

    test('for null (defaults to empty array)', () => {
      const value = null;
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toStrictEqual([]);
    });

    test('for undefined (defaults to empty array)', () => {
      const value = undefined;
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toStrictEqual([]);
    });

    test('for empty array', () => {
      const value: string[] = [];
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toStrictEqual([]);
    });
  });

  describe('should return dataset with issues', () => {
    test('for array of numbers when string schema', () => {
      const value = [1, 2, 3];
      const result = v.safeParse(schema, value);
      expect(result.success).toBeFalsy();
    });
  });

  describe('works with object schema', () => {
    const objectSchema = responseArray(v.object({ id: v.number(), name: v.string() }));

    test('for array of objects', () => {
      const value = [{ id: 1, name: 'Alice' }];
      const result = v.safeParse(objectSchema, value);
      assert.isTrue(result.success);
      expect(result.output).toStrictEqual(value);
    });

    test('for null', () => {
      const value = null;
      const result = v.safeParse(objectSchema, value);
      assert.isTrue(result.success);
      expect(result.output).toStrictEqual([]);
    });

    test('for undefined (defaults to empty array)', () => {
      const value = undefined;
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toStrictEqual([]);
    });
  });
});
