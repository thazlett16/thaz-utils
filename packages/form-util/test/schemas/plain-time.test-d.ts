import type { Temporal } from '@js-temporal/polyfill';
import type * as v from 'valibot';
import { describe, expectTypeOf, it } from 'vitest';

import { _plainTimeNullable, _plainTimeRequired, plainTime } from '#src/schemas/plain-time';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

describe('plainTime', () => {
  describe('nullable overload', () => {
    it('returns ReturnType<typeof _plainTimeNullable>', () => {
      expectTypeOf(plainTime(wrongTypeMessages)).toEqualTypeOf<ReturnType<typeof _plainTimeNullable>>();
    });

    it('InferInput includes PlainTime, ZonedDateTime, PlainDateTime, null, and undefined', () => {
      type Schema = ReturnType<typeof _plainTimeNullable>;
      expectTypeOf<v.InferInput<Schema>>().toEqualTypeOf<
        Temporal.PlainTime | Temporal.ZonedDateTime | Temporal.PlainDateTime | null | undefined
      >();
    });

    it('InferOutput is Temporal.PlainTime | null', () => {
      type Schema = ReturnType<typeof _plainTimeNullable>;
      expectTypeOf<v.InferOutput<Schema>>().toEqualTypeOf<Temporal.PlainTime | null>();
    });
  });

  describe('required overload', () => {
    const schema = _plainTimeRequired(requiredMessages);

    it('InferInput includes PlainTime, ZonedDateTime, PlainDateTime, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.PlainTime | Temporal.ZonedDateTime | Temporal.PlainDateTime | null | undefined
      >();
    });

    it('InferOutput is Temporal.PlainTime', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.PlainTime>();
    });
  });
});
