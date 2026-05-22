import * as v from 'valibot';

/**
 * Wraps a base schema in an optional, nullable array that defaults to an empty array.
 *
 * A `null` or absent field is coerced to `[]`, so consumers always receive an array
 * rather than `null | undefined`. Don't use this when null vs undefined represent meaning.
 *
 * @param baseSchema The schema for each array element.
 * @returns An optional nullable array schema with a default of `[]`.
 */
export function responseArray<T extends v.GenericSchema>(baseSchema: T) {
  return v.optional(v.nullable(v.array(baseSchema), []), []);
}
