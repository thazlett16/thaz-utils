import type { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { _plainTimeNullable, _plainTimeRequired } from '#src/schemas/plain-time';
import { plainTime } from '#src/schemas/plain-time';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

describe('plainTime', () => {
  describe('nullable overload', () => {
    const schema = plainTime(wrongTypeMessages);

    test('returns ReturnType<typeof _plainTimeNullable>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _plainTimeNullable>>();
    });

    test('inferInput includes Temporal.PlainTime, Temporal.ZonedDateTime, Temporal.PlainDateTime, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.PlainTime | Temporal.ZonedDateTime | Temporal.PlainDateTime | null | undefined
      >();
    });

    test('inferOutput is Temporal.PlainTime | null', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.PlainTime | null>();
    });
  });

  describe('nullable overload - additional validation', () => {
    const schema = plainTime(
      wrongTypeMessages,
      v.check((val) => val.hour >= 0),
    );

    test('returns ReturnType<typeof _plainTimeNullable>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _plainTimeNullable>>();
    });

    test('inferInput includes Temporal.PlainTime, Temporal.ZonedDateTime, Temporal.PlainDateTime, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.PlainTime | Temporal.ZonedDateTime | Temporal.PlainDateTime | null | undefined
      >();
    });

    test('inferOutput is Temporal.PlainTime | null', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.PlainTime | null>();
    });
  });

  describe('required overload', () => {
    const schema = plainTime(requiredMessages);

    test('returns ReturnType<typeof _plainTimeRequired>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _plainTimeRequired>>();
    });

    test('inferInput includes Temporal.PlainTime, Temporal.ZonedDateTime, Temporal.PlainDateTime, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.PlainTime | Temporal.ZonedDateTime | Temporal.PlainDateTime | null | undefined
      >();
    });

    test('inferOutput is Temporal.PlainTime', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.PlainTime>();
    });
  });

  describe('required overload - additional validation', () => {
    const schema = plainTime(
      requiredMessages,
      v.check((val) => val.hour >= 0),
    );

    test('returns ReturnType<typeof _plainTimeRequired>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _plainTimeRequired>>();
    });

    test('inferInput includes Temporal.PlainTime, Temporal.ZonedDateTime, Temporal.PlainDateTime, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.PlainTime | Temporal.ZonedDateTime | Temporal.PlainDateTime | null | undefined
      >();
    });

    test('inferOutput is Temporal.PlainTime', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.PlainTime>();
    });
  });
});
