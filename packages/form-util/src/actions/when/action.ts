import * as v from 'valibot';

/**
 *
 * @param condition
 * @param ifAction
 * @param elseAction
 */
export function when<TInput>(
    condition: boolean,
    ifAction: v.GenericPipeAction<TInput>,
    elseAction: v.GenericPipeAction<TInput>,
) {
    if (condition) {
        return ifAction;
    }

    return elseAction ?? v.check(() => true);
}
