import * as v from 'valibot';
import { assert, describe, expect, test } from 'vite-plus/test';

import { responseBoolean } from '#src/valibot/schema/boolean';

describe('responseBoolean', () => {
  describe('with default true', () => {
    const schema = responseBoolean(true);

    test('passes through true', () => {
      const value = true;
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toBeTruthy();
    });

    test('passes through false', () => {
      const value = false;
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toBeFalsy();
    });

    test('defaults null to true', () => {
      const value = null;
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toBeTruthy();
    });

    test('defaults undefined to true', () => {
      const value = undefined;
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toBeTruthy();
    });
  });

  describe('with default false', () => {
    const schema = responseBoolean(false);

    test('passes through true', () => {
      const value = true;
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toBeTruthy();
    });

    test('defaults null to false', () => {
      const value = null;
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toBeFalsy();
    });

    test('defaults undefined to false', () => {
      const value = undefined;
      const result = v.safeParse(schema, value);
      assert.isTrue(result.success);
      expect(result.output).toBeFalsy();
    });
  });

  describe('should fail for non-boolean types and give fallback', () => {
    const schema = responseBoolean(false);

    test('for strings', () => {
      const value = 'true';
      const result = v.safeParse(schema, value);
      expect(result.success).toBeFalsy();
    });

    test('for numbers', () => {
      const value = 1;
      const result = v.safeParse(schema, value);
      expect(result.success).toBeFalsy();
    });
  });
});
