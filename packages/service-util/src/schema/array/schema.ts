import * as v from 'valibot';

export function responseArray<T extends v.GenericSchema>(baseSchema: T) {
    return v.optional(v.nullable(v.array(baseSchema), []), []);
}

// const responseArrayPrimitiveExample = responseArray(v.string());
// type InputResponseArrayPrimitiveExample = v.InferInput<typeof responseArrayPrimitiveExample>
// type OutputResponseArrayPrimitiveExample = v.InferOutput<typeof responseArrayPrimitiveExample>

// const responseNullableObjectExample = responseArray(v.object({
//     test1: v.string(),
//     test2: v.number(),
// }));
// type InputResponseNullableObjectExample = v.InferInput<typeof responseNullableObjectExample>
// type OutputResponseNullableObjectExample = v.InferOutput<typeof responseNullableObjectExample>
