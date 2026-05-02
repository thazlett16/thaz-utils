import * as v from 'valibot';
import { describe, expect, it } from 'vitest';

import { number } from '#src/schemas/number';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

describe('number', () => {
  describe('nullable overload', () => {
    const schema = number(wrongTypeMessages);

    it('passes null through', () => {
      expect(v.safeParse(schema, null)).toMatchObject({ success: true, output: null });
    });

    it('coerces undefined to null', () => {
      expect(v.safeParse(schema, undefined)).toMatchObject({ success: true, output: null });
    });

    it('passes a positive finite number', () => {
      expect(v.safeParse(schema, 42)).toMatchObject({ success: true, output: 42 });
    });

    it('passes zero', () => {
      expect(v.safeParse(schema, 0)).toMatchObject({ success: true, output: 0 });
    });

    it('passes a negative finite number', () => {
      expect(v.safeParse(schema, -1.5)).toMatchObject({ success: true, output: -1.5 });
    });

    it('rejects Infinity with wrongTypeMessage', () => {
      const result = v.safeParse(schema, Infinity);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    it('rejects negative Infinity with wrongTypeMessage', () => {
      const result = v.safeParse(schema, -Infinity);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    it('rejects NaN with wrongTypeMessage', () => {
      const result = v.safeParse(schema, NaN);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    it('rejects strings with wrongTypeMessage', () => {
      const result = v.safeParse(schema, '42');
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

    it('passes extra number actions', () => {
      const schemaWithAction = number(wrongTypeMessages, v.minValue(10, 'too small'));
      expect(v.safeParse(schemaWithAction, 9).success).toBeFalsy();
      expect(v.safeParse(schemaWithAction, 10).success).toBeTruthy();
    });
  });

  describe('required overload', () => {
    const schema = number(requiredMessages);

    it('passes a finite number', () => {
      expect(v.safeParse(schema, 42)).toMatchObject({ success: true, output: 42 });
    });

    it('passes zero', () => {
      expect(v.safeParse(schema, 0)).toMatchObject({ success: true, output: 0 });
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

    it('rejects strings with wrongTypeMessage', () => {
      const result = v.safeParse(schema, '42');
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    it('rejects Infinity with wrongTypeMessage', () => {
      const result = v.safeParse(schema, Infinity);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    it('rejects NaN with wrongTypeMessage', () => {
      const result = v.safeParse(schema, NaN);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    it('passes extra number actions', () => {
      const schemaWithAction = number(requiredMessages, v.minValue(10, 'too small'));
      expect(v.safeParse(schemaWithAction, 9).success).toBeFalsy();
      expect(v.safeParse(schemaWithAction, 10).success).toBeTruthy();
    });
  });
});
