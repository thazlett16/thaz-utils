import * as v from 'valibot';
import { describe, expectTypeOf, it } from 'vitest';

import { when } from '#src/actions/when';

describe('when', () => {
  it('returns the same action type as inputs', () => {
    const action = v.check<string>(() => true);
    expectTypeOf(when(true, action, action)).toMatchTypeOf<v.GenericPipeAction<string, string>>();
  });

  it('infers TInput from the action type', () => {
    const numAction = v.check<number>(() => true);
    const result = when(true, numAction, numAction);
    expectTypeOf(result).toMatchTypeOf<v.GenericPipeAction<number, number>>();
  });
});
