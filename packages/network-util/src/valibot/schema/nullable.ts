import * as v from 'valibot';

export function responseNullable<T extends v.GenericSchema>(baseSchema: T) {
  return v.optional(
    v.nullable(
      v.union([
        baseSchema,
        v.pipe(
          v.strictObject({}),
          v.transform(() => {
            return null;
          }),
        ),
      ]),
    ),
    null,
  );
}
