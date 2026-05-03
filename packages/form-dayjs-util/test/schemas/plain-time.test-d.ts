import { Temporal } from '@js-temporal/polyfill';
import type { Dayjs } from 'dayjs';
import * as v from 'valibot';
import { describe, expectTypeOf, it } from 'vitest';

import type { _plainTimeNullable, _plainTimeRequired } from '#src/schemas/plain-time';

import { plainTime } from '#src/schemas/plain-time';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

describe('plainTime', () => {
  describe('nullable overload', () => {
    const schema = plainTime(wrongTypeMessages);

    it('returns ReturnType<typeof _plainTimeNullable>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _plainTimeNullable>>();
    });

    it('inferInput includes Temporal.PlainTime, Temporal.ZonedDateTime, Temporal.PlainDateTime, Dayjs, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.PlainTime | Temporal.ZonedDateTime | Temporal.PlainDateTime | Dayjs | null | undefined
      >();
    });

    it('inferOutput is Temporal.PlainTime | null', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.PlainTime | null>();
    });
  });

  describe('nullable overload - additional validation', () => {
    const schema = plainTime(
      wrongTypeMessages,
      v.check((val) => val.hour >= 0),
    );

    it('returns ReturnType<typeof _plainTimeNullable>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _plainTimeNullable>>();
    });

    it('inferInput includes Temporal.PlainTime, Temporal.ZonedDateTime, Temporal.PlainDateTime, Dayjs, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.PlainTime | Temporal.ZonedDateTime | Temporal.PlainDateTime | Dayjs | null | undefined
      >();
    });

    it('inferOutput is Temporal.PlainTime | null', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.PlainTime | null>();
    });
  });

  describe('required overload', () => {
    const schema = plainTime(requiredMessages);

    it('returns ReturnType<typeof _plainTimeRequired>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _plainTimeRequired>>();
    });

    it('inferInput includes Temporal.PlainTime, Temporal.ZonedDateTime, Temporal.PlainDateTime, Dayjs, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.PlainTime | Temporal.ZonedDateTime | Temporal.PlainDateTime | Dayjs | null | undefined
      >();
    });

    it('inferOutput is Temporal.PlainTime', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.PlainTime>();
    });
  });

  describe('required overload - additional validation', () => {
    const schema = plainTime(
      requiredMessages,
      v.check((val) => val.hour >= 0),
    );

    it('returns ReturnType<typeof _plainTimeRequired>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _plainTimeRequired>>();
    });

    it('inferInput includes Temporal.PlainTime, Temporal.ZonedDateTime, Temporal.PlainDateTime, Dayjs, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.PlainTime | Temporal.ZonedDateTime | Temporal.PlainDateTime | Dayjs | null | undefined
      >();
    });

    it('inferOutput is Temporal.PlainTime', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.PlainTime>();
    });
  });
});
