import * as v from 'valibot';

/**
 * Wraps a base schema as optional and nullable, coercing empty objects `{}` to `null`.
 *
 * Some API responses represent "no value" as an empty object rather than a JSON `null`.
 * This wrapper normalises both representations to `null` so consumers receive a consistent
 * `T | null` type. A missing field also defaults to `null`.
 *
 * @param baseSchema The schema to use when the field contains a real value.
 * @returns An optional nullable schema that defaults to `null` and treats `{}` as `null`.
 */
export function responseNullable<T extends v.GenericSchema>(baseSchema: T) {
  return v.optional(
    v.union([
      baseSchema,
      v.null(),
      v.pipe(
        v.strictObject({}),
        v.transform(() => {
          return null;
        }),
      ),
    ]),
    null,
  );
}
