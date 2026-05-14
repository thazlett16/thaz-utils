import * as v from 'valibot';

export function responseArray<T extends v.GenericSchema>(baseSchema: T) {
  return v.optional(v.nullable(v.array(baseSchema), []), []);
}
