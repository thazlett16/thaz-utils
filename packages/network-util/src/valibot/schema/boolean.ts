import * as v from 'valibot';

export function responseBoolean(defaultValue: boolean) {
  return v.optional(v.nullable(v.boolean(), defaultValue), defaultValue);
}
