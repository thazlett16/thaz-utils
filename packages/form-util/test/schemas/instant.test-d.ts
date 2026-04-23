import type { Temporal } from '@js-temporal/polyfill';
import type * as v from 'valibot';
import { describe, expectTypeOf, it } from 'vitest';

import { _instantNullable, _instantRequired, instant } from '#src/schemas/instant';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

describe('instant', () => {
  describe('nullable overload', () => {
    it('returns ReturnType<typeof _instantNullable>', () => {
      expectTypeOf(instant(wrongTypeMessages)).toEqualTypeOf<ReturnType<typeof _instantNullable>>();
    });

    it('InferInput includes Instant, ZonedDateTime, null, and undefined', () => {
      type Schema = ReturnType<typeof _instantNullable>;
      expectTypeOf<v.InferInput<Schema>>().toEqualTypeOf<
        Temporal.Instant | Temporal.ZonedDateTime | null | undefined
      >();
    });

    it('InferOutput is Temporal.Instant | null', () => {
      type Schema = ReturnType<typeof _instantNullable>;
      expectTypeOf<v.InferOutput<Schema>>().toEqualTypeOf<Temporal.Instant | null>();
    });
  });

  describe('required overload', () => {
    const schema = _instantRequired(requiredMessages);

    it('InferInput includes Instant, ZonedDateTime, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.Instant | Temporal.ZonedDateTime | null | undefined
      >();
    });

    it('InferOutput is Temporal.Instant', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.Instant>();
    });
  });
});
