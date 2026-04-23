import type { Temporal } from '@js-temporal/polyfill';
import type * as v from 'valibot';
import { describe, expectTypeOf, it } from 'vitest';

import { _plainDateNullable, _plainDateRequired, plainDate } from '#src/schemas/plain-date';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

describe('plainDate', () => {
  describe('nullable overload', () => {
    it('returns ReturnType<typeof _plainDateNullable>', () => {
      expectTypeOf(plainDate(wrongTypeMessages)).toEqualTypeOf<ReturnType<typeof _plainDateNullable>>();
    });

    it('InferInput includes PlainDate, ZonedDateTime, PlainDateTime, null, and undefined', () => {
      type Schema = ReturnType<typeof _plainDateNullable>;
      expectTypeOf<v.InferInput<Schema>>().toEqualTypeOf<
        Temporal.PlainDate | Temporal.ZonedDateTime | Temporal.PlainDateTime | null | undefined
      >();
    });

    it('InferOutput is Temporal.PlainDate | null', () => {
      type Schema = ReturnType<typeof _plainDateNullable>;
      expectTypeOf<v.InferOutput<Schema>>().toEqualTypeOf<Temporal.PlainDate | null>();
    });
  });

  describe('required overload', () => {
    const schema = _plainDateRequired(requiredMessages);

    it('InferInput includes PlainDate, ZonedDateTime, PlainDateTime, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.PlainDate | Temporal.ZonedDateTime | Temporal.PlainDateTime | null | undefined
      >();
    });

    it('InferOutput is Temporal.PlainDate', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.PlainDate>();
    });
  });
});
