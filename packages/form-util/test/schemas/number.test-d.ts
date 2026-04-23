import type * as v from 'valibot';
import { describe, expectTypeOf, it } from 'vitest';

import { _numberNullable, _numberRequired, number } from '#src/schemas/number';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

describe('number', () => {
  describe('nullable overload', () => {
    it('returns ReturnType<typeof _numberNullable>', () => {
      expectTypeOf(number(wrongTypeMessages)).toEqualTypeOf<ReturnType<typeof _numberNullable>>();
    });

    it('InferInput includes number, null, and undefined', () => {
      type Schema = ReturnType<typeof _numberNullable>;
      expectTypeOf<v.InferInput<Schema>>().toEqualTypeOf<number | null | undefined>();
    });

    it('InferOutput is number | null', () => {
      type Schema = ReturnType<typeof _numberNullable>;
      expectTypeOf<v.InferOutput<Schema>>().toEqualTypeOf<number | null>();
    });
  });

  describe('required overload', () => {
    const schema = _numberRequired(requiredMessages);

    it('InferInput includes number, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<number | null | undefined>();
    });

    it('InferOutput is number', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<number>();
    });
  });
});
