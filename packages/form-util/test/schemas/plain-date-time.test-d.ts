import type { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { _plainDateTimeNullable, _plainDateTimeRequired } from '#src/schemas/plain-date-time';
import { plainDateTime } from '#src/schemas/plain-date-time';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

describe('plainDateTime', () => {
  describe('nullable overload', () => {
    const schema = plainDateTime(wrongTypeMessages);

    test('returns ReturnType<typeof _plainDateTimeNullable>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _plainDateTimeNullable>>();
    });

    test('inferInput includes Temporal.PlainDateTime, Temporal.ZonedDateTime, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.PlainDateTime | Temporal.ZonedDateTime | null | undefined
      >();
    });

    test('inferOutput is Temporal.PlainDateTime | null', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.PlainDateTime | null>();
    });
  });

  describe('nullable overload - additional validation', () => {
    const schema = plainDateTime(
      wrongTypeMessages,
      v.check((val) => val.hour >= 0),
    );

    test('returns ReturnType<typeof _plainDateTimeNullable>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _plainDateTimeNullable>>();
    });

    test('inferInput includes Temporal.PlainDateTime, Temporal.ZonedDateTime, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.PlainDateTime | Temporal.ZonedDateTime | null | undefined
      >();
    });

    test('inferOutput is Temporal.PlainDateTime | null', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.PlainDateTime | null>();
    });
  });

  describe('required overload', () => {
    const schema = plainDateTime(requiredMessages);

    test('returns ReturnType<typeof _plainDateTimeRequired>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _plainDateTimeRequired>>();
    });

    test('inferInput includes Temporal.PlainDateTime, Temporal.ZonedDateTime, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.PlainDateTime | Temporal.ZonedDateTime | null | undefined
      >();
    });

    test('inferOutput is Temporal.PlainDateTime', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.PlainDateTime>();
    });
  });

  describe('required overload - additional validation', () => {
    const schema = plainDateTime(
      requiredMessages,
      v.check((val) => val.hour >= 0),
    );

    test('returns ReturnType<typeof _plainDateTimeRequired>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _plainDateTimeRequired>>();
    });

    test('inferInput includes Temporal.PlainDateTime, Temporal.ZonedDateTime, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.PlainDateTime | Temporal.ZonedDateTime | null | undefined
      >();
    });

    test('inferOutput is Temporal.PlainDateTime', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.PlainDateTime>();
    });
  });
});
