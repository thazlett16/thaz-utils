import * as v from 'valibot';
import { describe, expect, test } from 'vite-plus/test';

import { when } from '#src/actions/when';

describe('when', () => {
  const ifAction = v.minLength(3, 'min length 3');
  const elseAction = v.maxLength(100, 'max length 100');

  test('returns ifAction when condition is true', () => {
    expect(when(true, ifAction, elseAction)).toBe(ifAction);
  });

  test('returns elseAction when condition is false', () => {
    expect(when(false, ifAction, elseAction)).toBe(elseAction);
  });
});
