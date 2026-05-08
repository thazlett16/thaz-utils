import * as v from 'valibot';
import { describe, expect, test } from 'vite-plus/test';

import { string } from '#src/schemas/string';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

describe('string', () => {
  describe('nullable overload', () => {
    const schema = string(wrongTypeMessages);

    test('passes null through', () => {
      expect(v.safeParse(schema, null)).toMatchObject({ success: true, output: null });
    });

    test('coerces undefined to null', () => {
      expect(v.safeParse(schema, undefined)).toMatchObject({ success: true, output: null });
    });

    test('coerces empty string to null', () => {
      expect(v.safeParse(schema, '')).toMatchObject({ success: true, output: null });
    });

    test('coerces whitespace-only string to null', () => {
      expect(v.safeParse(schema, '   ')).toMatchObject({ success: true, output: null });
      expect(v.safeParse(schema, '\t\n')).toMatchObject({ success: true, output: null });
    });

    test('trims and passes non-blank string', () => {
      expect(v.safeParse(schema, '  hello  ')).toMatchObject({ success: true, output: 'hello' });
    });

    test('passes non-blank string as-is after trim', () => {
      expect(v.safeParse(schema, 'hello')).toMatchObject({ success: true, output: 'hello' });
    });

    test('rejects numbers with wrongTypeMessage', () => {
      const result = v.safeParse(schema, 42);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    test('rejects objects', () => {
      expect(v.safeParse(schema, {}).success).toBeFalsy();
    });

    test('rejects booleans', () => {
      expect(v.safeParse(schema, true).success).toBeFalsy();
      expect(v.safeParse(schema, false).success).toBeFalsy();
    });

    test('passes extra string actions', () => {
      const schemaWithAction = string(wrongTypeMessages, v.minLength(3, 'too short'));
      expect(v.safeParse(schemaWithAction, 'hi').success).toBeFalsy();
      expect(v.safeParse(schemaWithAction, 'hey').success).toBeTruthy();
    });
  });

  describe('required overload', () => {
    const schema = string(requiredMessages);

    test('passes non-blank string', () => {
      expect(v.safeParse(schema, 'hello')).toMatchObject({ success: true, output: 'hello' });
    });

    test('trims and passes non-blank string', () => {
      expect(v.safeParse(schema, '  hello  ')).toMatchObject({ success: true, output: 'hello' });
    });

    test('rejects null with requiredMessage', () => {
      const result = v.safeParse(schema, null);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Required');
    });

    test('rejects undefined with requiredMessage', () => {
      const result = v.safeParse(schema, undefined);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Required');
    });

    test('rejects empty string with requiredMessage', () => {
      const result = v.safeParse(schema, '');
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Required');
    });

    test('rejects whitespace-only string with requiredMessage', () => {
      const result = v.safeParse(schema, '   ');
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Required');
    });

    test('rejects wrong types with wrongTypeMessage', () => {
      const result = v.safeParse(schema, 42);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    test('passes extra string actions', () => {
      const schemaWithAction = string(requiredMessages, v.minLength(3, 'too short'));
      expect(v.safeParse(schemaWithAction, 'hi').success).toBeFalsy();
      expect(v.safeParse(schemaWithAction, 'hey').success).toBeTruthy();
    });
  });
});
