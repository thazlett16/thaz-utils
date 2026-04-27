import type { Temporal } from '@js-temporal/polyfill';
import type * as v from 'valibot';
import { describe, expectTypeOf, it } from 'vitest';

import { _zonedDateTimeNullable, _zonedDateTimeRequired, zonedDateTime } from '#src/schemas/zoned-date-time';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

describe('zonedDateTime', () => {
  describe('nullable overload', () => {
    it('returns ReturnType<typeof _zonedDateTimeNullable>', () => {
      expectTypeOf(zonedDateTime(wrongTypeMessages)).toEqualTypeOf<ReturnType<typeof _zonedDateTimeNullable>>();
    });

    it('InferInput includes ZonedDateTime, null, and undefined', () => {
      type Schema = ReturnType<typeof _zonedDateTimeNullable>;
      expectTypeOf<v.InferInput<Schema>>().toEqualTypeOf<Temporal.ZonedDateTime | null | undefined>();
    });

    it('InferOutput is Temporal.ZonedDateTime | null', () => {
      type Schema = ReturnType<typeof _zonedDateTimeNullable>;
      expectTypeOf<v.InferOutput<Schema>>().toEqualTypeOf<Temporal.ZonedDateTime | null>();
    });
  });

  describe('required overload', () => {
    const schema = _zonedDateTimeRequired(requiredMessages);

    it('InferInput includes ZonedDateTime, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<Temporal.ZonedDateTime | null | undefined>();
    });

    it('InferOutput is Temporal.ZonedDateTime', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.ZonedDateTime>();
    });
  });
});
