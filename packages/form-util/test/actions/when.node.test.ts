import * as v from 'valibot';
import { describe, expect, test } from 'vite-plus/test';

import { when } from '#src/actions/when';

describe('when', () => {
  const ifAction = v.check<string>(() => true);
  const elseAction = v.check<string>(() => false);

  test('returns ifAction when condition is true', () => {
    expect(when(true, ifAction, elseAction)).toBe(ifAction);
  });

  test('returns elseAction when condition is false', () => {
    expect(when(false, ifAction, elseAction)).toBe(elseAction);
  });

  test('works inside a pipe — applies ifAction on true', () => {
    const schema = v.pipe(v.string(), when(true, v.minLength(3, 'too short'), v.maxLength(1, 'too long')));
    expect(v.safeParse(schema, 'ab').success).toBeFalsy();
    expect(v.safeParse(schema, 'abc').success).toBeTruthy();
  });

  test('works inside a pipe — applies elseAction on false', () => {
    const schema = v.pipe(v.string(), when(false, v.minLength(3, 'too short'), v.maxLength(1, 'too long')));
    expect(v.safeParse(schema, 'ab').success).toBeFalsy();
    expect(v.safeParse(schema, 'a').success).toBeTruthy();
  });
});
