import * as v from 'valibot';

export function responseBoolean(defaultValue: boolean) {
  return v.optional(v.nullable(v.boolean(), defaultValue), defaultValue);
}

// const responseBooleanExample = responseBoolean(true);
// type InputResponseBooleanExample = v.InferInput<typeof responseBooleanExample>
// type OutputResponseBooleanExample = v.InferOutput<typeof responseBooleanExample>
