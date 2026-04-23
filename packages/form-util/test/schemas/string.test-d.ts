import type * as v from 'valibot';
import { describe, expectTypeOf, it } from 'vitest';

import { _stringNullable, _stringRequired, string } from '#src/schemas/string';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

describe('string', () => {
  describe('nullable overload', () => {
    it('returns ReturnType<typeof _stringNullable>', () => {
      expectTypeOf(string(wrongTypeMessages)).toEqualTypeOf<ReturnType<typeof _stringNullable>>();
    });

    it('InferInput includes string, null, and undefined', () => {
      type Schema = ReturnType<typeof _stringNullable>;
      expectTypeOf<v.InferInput<Schema>>().toEqualTypeOf<string | null | undefined>();
    });

    it('InferOutput is string | null', () => {
      type Schema = ReturnType<typeof _stringNullable>;
      expectTypeOf<v.InferOutput<Schema>>().toEqualTypeOf<string | null>();
    });
  });

  describe('required overload', () => {
    const schema = _stringRequired(requiredMessages);

    it('InferInput includes string, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<string | null | undefined>();
    });

    it('InferOutput is string', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<string>();
    });
  });
});
