import type { Temporal } from '@js-temporal/polyfill';
import type * as v from 'valibot';
import { describe, expectTypeOf, it } from 'vitest';

import { _plainDateTimeNullable, _plainDateTimeRequired, plainDateTime } from '#src/schemas/plain-date-time';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

describe('plainDateTime', () => {
  describe('nullable overload', () => {
    it('returns ReturnType<typeof _plainDateTimeNullable>', () => {
      expectTypeOf(plainDateTime(wrongTypeMessages)).toEqualTypeOf<ReturnType<typeof _plainDateTimeNullable>>();
    });

    it('InferInput includes PlainDateTime, ZonedDateTime, null, and undefined', () => {
      type Schema = ReturnType<typeof _plainDateTimeNullable>;
      expectTypeOf<v.InferInput<Schema>>().toEqualTypeOf<
        Temporal.PlainDateTime | Temporal.ZonedDateTime | null | undefined
      >();
    });

    it('InferOutput is Temporal.PlainDateTime | null', () => {
      type Schema = ReturnType<typeof _plainDateTimeNullable>;
      expectTypeOf<v.InferOutput<Schema>>().toEqualTypeOf<Temporal.PlainDateTime | null>();
    });
  });

  describe('required overload', () => {
    const schema = _plainDateTimeRequired(requiredMessages);

    it('InferInput includes PlainDateTime, ZonedDateTime, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.PlainDateTime | Temporal.ZonedDateTime | null | undefined
      >();
    });

    it('InferOutput is Temporal.PlainDateTime', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.PlainDateTime>();
    });
  });
});
