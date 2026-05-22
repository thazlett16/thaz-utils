import * as v from 'valibot';
import { assert, describe, expect, test } from 'vite-plus/test';

import { responseNullable } from '#src/valibot/schema/nullable';

describe('responseNullable', () => {
  describe('with string schema', () => {
    const schema = responseNullable(v.string());

    test('passes through a valid string', () => {
      const value = 'hello';
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toBe('hello');
    });

    test('passes through null', () => {
      const value = null;
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toBeNull();
    });

    test('defaults undefined to null', () => {
      const value = undefined;
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toBeNull();
    });

    test('converts empty object {} to null', () => {
      const value = {};
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toBeNull();
    });

    describe('should return dataset with issues', () => {
      test('for numbers', () => {
        const value = 42;
        const result = v.safeParse(schema, value);
        expect(result.success).toBeFalsy();
      });

      test('for arrays', () => {
        const value = ['a', 'b'];
        const result = v.safeParse(schema, value);
        expect(result.success).toBeFalsy();
      });
    });
  });

  describe('with object schema', () => {
    const schema = responseNullable(v.object({ id: v.number(), name: v.string() }));

    test('passes through a valid object', () => {
      const value = { id: 1, name: 'Alice' };
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toStrictEqual({ id: 1, name: 'Alice' });
    });

    test('passes through null', () => {
      const value = null;
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toBeNull();
    });

    test('defaults undefined to null', () => {
      const value = undefined;
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toBeNull();
    });

    test('converts empty object {} to null', () => {
      const value = {};
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toBeNull();
    });
  });

  describe('with nested object schema', () => {
    const schema = responseNullable(v.object({ id: v.number(), name: responseNullable(v.string()) }));

    test('passes through a valid object', () => {
      const value = { id: 1, name: 'Alice' };
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toStrictEqual({ id: 1, name: 'Alice' });
    });

    test('passes through a valid object nested pases through null', () => {
      const value = { id: 1, name: null };
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toStrictEqual({ id: 1, name: null });
    });

    test('passes through a valid object nested defaults undefined to null', () => {
      const value = { id: 1, name: null };
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toStrictEqual({ id: 1, name: null });
    });

    test('passes through a valid object nested defaults missing to null', () => {
      const value = { id: 1 };
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toStrictEqual({ id: 1, name: null });
    });

    test('passes through a valid object nested converts empty object to null', () => {
      const value = { id: 1, name: {} };
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toStrictEqual({ id: 1, name: null });
    });

    test('passes through null', () => {
      const value = null;
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toBeNull();
    });

    test('defaults undefined to null', () => {
      const value = undefined;
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toBeNull();
    });

    test('converts empty object {} to null', () => {
      const value = {};
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toBeNull();
    });
  });
});
