import * as v from 'valibot';

export function responseNullable<T extends v.GenericSchema>(baseSchema: T) {
    return v.optional(
        v.nullable(
            v.union([
                v.pipe(
                    v.strictObject({}),
                    v.transform(() => {
                        return null;
                    }),
                ),
                baseSchema,
            ]),
        ),
        null,
    );
}

// const responseNullablePrimitiveExample = responseNullable(v.string());
// type InputResponseNullablePrimitiveExample = v.InferInput<typeof responseNullablePrimitiveExample>
// type OutputResponseNullablePrimitiveExample = v.InferOutput<typeof responseNullablePrimitiveExample>

// const responseNullableObjectExample = responseNullable(v.object({
//     test1: v.string(),
//     test2: v.number(),
//     test3: responseNullable(v.string()),
// }));
// type InputResponseNullableObjectExample = v.InferInput<typeof responseNullableObjectExample>
// type OutputResponseNullableObjectExample = v.InferOutput<typeof responseNullableObjectExample>
