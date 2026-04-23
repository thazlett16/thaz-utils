import * as v from 'valibot';
import { describe, expect, it } from 'vitest';

import { number } from '#src/schemas/number';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

describe('number (nullable)', () => {
  const schema = number(wrongTypeMessages);

  it('passes null through', () => {
    expect(v.safeParse(schema, null)).toMatchObject({ success: true, output: null });
  });

  it('coerces undefined to null', () => {
    expect(v.safeParse(schema, undefined)).toMatchObject({ success: true, output: null });
  });

  it('passes a finite integer', () => {
    expect(v.safeParse(schema, 42)).toMatchObject({ success: true, output: 42 });
  });

  it('passes a finite float', () => {
    expect(v.safeParse(schema, 3.14)).toMatchObject({ success: true, output: 3.14 });
  });

  it('passes zero', () => {
    expect(v.safeParse(schema, 0)).toMatchObject({ success: true, output: 0 });
  });

  it('passes negative numbers', () => {
    expect(v.safeParse(schema, -7)).toMatchObject({ success: true, output: -7 });
  });

  it('rejects Infinity with wrongTypeMessage', () => {
    const result = v.safeParse(schema, Infinity);
    expect(result.success).toBe(false);
    expect(result.issues?.[0]?.message).toBe('Wrong type');
  });

  it('rejects NaN', () => {
    expect(v.safeParse(schema, Number.NaN).success).toBe(false);
  });

  it('rejects strings', () => {
    expect(v.safeParse(schema, '42').success).toBe(false);
  });

  it('rejects objects', () => {
    expect(v.safeParse(schema, {}).success).toBe(false);
  });

  it('passes extra number actions', () => {
    const schemaWithAction = number(wrongTypeMessages, v.minValue(10, 'too small'));
    expect(v.safeParse(schemaWithAction, 5).success).toBe(false);
    expect(v.safeParse(schemaWithAction, 10).success).toBe(true);
  });
});

describe('number (required)', () => {
  const schema = number(requiredMessages);

  it('passes a finite number', () => {
    expect(v.safeParse(schema, 42)).toMatchObject({ success: true, output: 42 });
  });

  it('rejects null with requiredMessage', () => {
    const result = v.safeParse(schema, null);
    expect(result.success).toBe(false);
    expect(result.issues?.[0]?.message).toBe('Required');
  });

  it('rejects undefined with requiredMessage', () => {
    const result = v.safeParse(schema, undefined);
    expect(result.success).toBe(false);
    expect(result.issues?.[0]?.message).toBe('Required');
  });

  it('rejects Infinity with wrongTypeMessage', () => {
    const result = v.safeParse(schema, Infinity);
    expect(result.success).toBe(false);
    expect(result.issues?.[0]?.message).toBe('Wrong type');
  });

  it('rejects strings with wrongTypeMessage', () => {
    const result = v.safeParse(schema, 'hello');
    expect(result.success).toBe(false);
    expect(result.issues?.[0]?.message).toBe('Wrong type');
  });

  it('passes extra number actions', () => {
    const schemaWithAction = number(requiredMessages, v.maxValue(100, 'too large'));
    expect(v.safeParse(schemaWithAction, 200).success).toBe(false);
    expect(v.safeParse(schemaWithAction, 50).success).toBe(true);
  });
});
