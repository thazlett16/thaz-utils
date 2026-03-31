import * as v from 'valibot';

/**
 *
 * @param condition
 * @param ifAction
 * @param elseAction
 */
export function when<TInput>(
  condition: boolean,
  ifAction: v.GenericPipeAction<TInput, TInput>,
  elseAction: v.GenericPipeAction<TInput, TInput>,
) {
  if (condition) {
    return ifAction;
  }

  return elseAction ?? v.check(() => true);
}
