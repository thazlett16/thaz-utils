import * as v from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import { when } from '#src/actions/when';

describe('when', () => {
  test('returns the same action type as inputs', () => {
    const action = v.check<string>(() => true);
    expectTypeOf(when(true, action, action)).toMatchTypeOf<v.GenericPipeAction<string, string>>();
  });

  test('infers TInput from the action type', () => {
    const numAction = v.check<number>(() => true);
    const result = when(true, numAction, numAction);
    expectTypeOf(result).toMatchTypeOf<v.GenericPipeAction<number, number>>();
  });
});
