import * as v from 'valibot';
import { describe, expect, it } from 'vitest';

import { when } from '#src/actions/when';

describe('when', () => {
  const ifAction = v.check<string>(() => true);
  const elseAction = v.check<string>(() => false);

  it('returns ifAction when condition is true', () => {
    expect(when(true, ifAction, elseAction)).toBe(ifAction);
  });

  it('returns elseAction when condition is false', () => {
    expect(when(false, ifAction, elseAction)).toBe(elseAction);
  });

  it('works inside a pipe — applies ifAction on true', () => {
    const schema = v.pipe(v.string(), when(true, v.minLength(3, 'too short'), v.maxLength(1, 'too long')));
    expect(v.safeParse(schema, 'ab').success).toBe(false);
    expect(v.safeParse(schema, 'abc').success).toBe(true);
  });

  it('works inside a pipe — applies elseAction on false', () => {
    const schema = v.pipe(v.string(), when(false, v.minLength(3, 'too short'), v.maxLength(1, 'too long')));
    expect(v.safeParse(schema, 'ab').success).toBe(false);
    expect(v.safeParse(schema, 'a').success).toBe(true);
  });
});
