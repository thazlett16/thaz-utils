import * as v from 'valibot';
import { describe, expect, test } from 'vite-plus/test';

import { number } from '#src/schemas/number';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

describe('number', () => {
  describe('nullable overload', () => {
    const schema = number(wrongTypeMessages);

    test('passes null through', () => {
      expect(v.safeParse(schema, null)).toMatchObject({ success: true, output: null });
    });

    test('coerces undefined to null', () => {
      expect(v.safeParse(schema, undefined)).toMatchObject({ success: true, output: null });
    });

    test('passes a positive finite number', () => {
      expect(v.safeParse(schema, 42)).toMatchObject({ success: true, output: 42 });
    });

    test('passes zero', () => {
      expect(v.safeParse(schema, 0)).toMatchObject({ success: true, output: 0 });
    });

    test('passes a negative finite number', () => {
      expect(v.safeParse(schema, -1.5)).toMatchObject({ success: true, output: -1.5 });
    });

    test('rejects Infinity with wrongTypeMessage', () => {
      const result = v.safeParse(schema, Infinity);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    test('rejects negative Infinity with wrongTypeMessage', () => {
      const result = v.safeParse(schema, -Infinity);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    test('rejects NaN with wrongTypeMessage', () => {
      const result = v.safeParse(schema, Number.NaN);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    test('rejects strings with wrongTypeMessage', () => {
      const result = v.safeParse(schema, '42');
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

    test('passes extra number actions', () => {
      const schemaWithAction = number(wrongTypeMessages, v.minValue(10, 'too small'));
      expect(v.safeParse(schemaWithAction, 9).success).toBeFalsy();
      expect(v.safeParse(schemaWithAction, 10).success).toBeTruthy();
    });
  });

  describe('required overload', () => {
    const schema = number(requiredMessages);

    test('passes a finite number', () => {
      expect(v.safeParse(schema, 42)).toMatchObject({ success: true, output: 42 });
    });

    test('passes zero', () => {
      expect(v.safeParse(schema, 0)).toMatchObject({ success: true, output: 0 });
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

    test('rejects strings with wrongTypeMessage', () => {
      const result = v.safeParse(schema, '42');
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    test('rejects Infinity with wrongTypeMessage', () => {
      const result = v.safeParse(schema, Infinity);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    test('rejects NaN with wrongTypeMessage', () => {
      const result = v.safeParse(schema, Number.NaN);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    test('passes extra number actions', () => {
      const schemaWithAction = number(requiredMessages, v.minValue(10, 'too small'));
      expect(v.safeParse(schemaWithAction, 9).success).toBeFalsy();
      expect(v.safeParse(schemaWithAction, 10).success).toBeTruthy();
    });
  });
});
