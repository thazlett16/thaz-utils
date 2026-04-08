import * as v from 'valibot';

export function serviceResponseBoolean(defaultValue: boolean) {
    return v.optional(v.nullable(v.boolean(), defaultValue), defaultValue);
}

// const serviceResponseBooleanExample = serviceResponseBoolean(true);
// type InputServiceResponseBooleanExample = v.InferInput<typeof serviceResponseBooleanExample>
// type OutputServiceResponseBooleanExample = v.InferOutput<typeof serviceResponseBooleanExample>
