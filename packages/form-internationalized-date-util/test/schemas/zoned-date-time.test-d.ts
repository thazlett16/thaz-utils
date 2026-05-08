import type { ZonedDateTime } from '@internationalized/date';
import type { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { _zonedDateTimeNullable, _zonedDateTimeRequired } from '#src/schemas/zoned-date-time';
import { zonedDateTime } from '#src/schemas/zoned-date-time';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

describe('zonedDateTime', () => {
  describe('nullable overload', () => {
    const schema = zonedDateTime(wrongTypeMessages);

    test('returns ReturnType<typeof _zonedDateTimeNullable>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _zonedDateTimeNullable>>();
    });

    test('inferInput includes Temporal.ZonedDateTime, ZonedDateTime, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.ZonedDateTime | ZonedDateTime | null | undefined
      >();
    });

    test('inferOutput is Temporal.ZonedDateTime | null', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.ZonedDateTime | null>();
    });
  });

  describe('nullable overload - additional validation', () => {
    const schema = zonedDateTime(
      wrongTypeMessages,
      v.check((val) => val.hour >= 0),
    );

    test('returns ReturnType<typeof _zonedDateTimeNullable>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _zonedDateTimeNullable>>();
    });

    test('inferInput includes Temporal.ZonedDateTime, ZonedDateTime, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.ZonedDateTime | ZonedDateTime | null | undefined
      >();
    });

    test('inferOutput is Temporal.ZonedDateTime | null', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.ZonedDateTime | null>();
    });
  });

  describe('required overload', () => {
    const schema = zonedDateTime(requiredMessages);

    test('returns ReturnType<typeof _zonedDateTimeRequired>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _zonedDateTimeRequired>>();
    });

    test('inferInput includes Temporal.ZonedDateTime, ZonedDateTime, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.ZonedDateTime | ZonedDateTime | null | undefined
      >();
    });

    test('inferOutput is Temporal.ZonedDateTime', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.ZonedDateTime>();
    });
  });

  describe('required overload - additional validation', () => {
    const schema = zonedDateTime(
      requiredMessages,
      v.check((val) => val.hour >= 0),
    );

    test('returns ReturnType<typeof _zonedDateTimeRequired>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _zonedDateTimeRequired>>();
    });

    test('inferInput includes Temporal.ZonedDateTime, ZonedDateTime, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.ZonedDateTime | ZonedDateTime | null | undefined
      >();
    });

    test('inferOutput is Temporal.ZonedDateTime', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.ZonedDateTime>();
    });
  });
});
