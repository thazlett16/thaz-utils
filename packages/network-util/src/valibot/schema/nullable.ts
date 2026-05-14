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
