import * as v from 'valibot';

/**
 * Wraps a boolean schema as optional and nullable, falling back to `defaultValue` when the
 * field is absent or `null`.
 *
 * @param defaultValue The value used when the field is `null` or `undefined`.
 * @returns An optional nullable boolean schema with the given default.
 */
export function responseBoolean(defaultValue: boolean) {
  return v.optional(v.nullable(v.boolean(), defaultValue), defaultValue);
}
