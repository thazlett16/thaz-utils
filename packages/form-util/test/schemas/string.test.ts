import * as v from 'valibot';
import { describe, expect, it } from 'vitest';

import { string } from '#src/schemas/string';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

describe('string', () => {
  describe('nullable overload', () => {
    const schema = string(wrongTypeMessages);

    it('passes null through', () => {
      expect(v.safeParse(schema, null)).toMatchObject({ success: true, output: null });
    });

    it('coerces undefined to null', () => {
      expect(v.safeParse(schema, undefined)).toMatchObject({ success: true, output: null });
    });

    it('coerces empty string to null', () => {
      expect(v.safeParse(schema, '')).toMatchObject({ success: true, output: null });
    });

    it('coerces whitespace-only string to null', () => {
      expect(v.safeParse(schema, '   ')).toMatchObject({ success: true, output: null });
      expect(v.safeParse(schema, '\t\n')).toMatchObject({ success: true, output: null });
    });

    it('trims and passes non-blank string', () => {
      expect(v.safeParse(schema, '  hello  ')).toMatchObject({ success: true, output: 'hello' });
    });

    it('passes non-blank string as-is after trim', () => {
      expect(v.safeParse(schema, 'hello')).toMatchObject({ success: true, output: 'hello' });
    });

    it('rejects numbers with wrongTypeMessage', () => {
      const result = v.safeParse(schema, 42);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    it('rejects objects', () => {
      expect(v.safeParse(schema, {}).success).toBeFalsy();
    });

    it('rejects booleans', () => {
      expect(v.safeParse(schema, true).success).toBeFalsy();
      expect(v.safeParse(schema, false).success).toBeFalsy();
    });

    it('passes extra string actions', () => {
      const schemaWithAction = string(wrongTypeMessages, v.minLength(3, 'too short'));
      expect(v.safeParse(schemaWithAction, 'hi').success).toBeFalsy();
      expect(v.safeParse(schemaWithAction, 'hey').success).toBeTruthy();
    });
  });

  describe('required overload', () => {
    const schema = string(requiredMessages);

    it('passes non-blank string', () => {
      expect(v.safeParse(schema, 'hello')).toMatchObject({ success: true, output: 'hello' });
    });

    it('trims and passes non-blank string', () => {
      expect(v.safeParse(schema, '  hello  ')).toMatchObject({ success: true, output: 'hello' });
    });

    it('rejects null with requiredMessage', () => {
      const result = v.safeParse(schema, null);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Required');
    });

    it('rejects undefined with requiredMessage', () => {
      const result = v.safeParse(schema, undefined);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Required');
    });

    it('rejects empty string with requiredMessage', () => {
      const result = v.safeParse(schema, '');
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Required');
    });

    it('rejects whitespace-only string with requiredMessage', () => {
      const result = v.safeParse(schema, '   ');
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Required');
    });

    it('rejects wrong types with wrongTypeMessage', () => {
      const result = v.safeParse(schema, 42);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    it('passes extra string actions', () => {
      const schemaWithAction = string(requiredMessages, v.minLength(3, 'too short'));
      expect(v.safeParse(schemaWithAction, 'hi').success).toBeFalsy();
      expect(v.safeParse(schemaWithAction, 'hey').success).toBeTruthy();
    });
  });
});
