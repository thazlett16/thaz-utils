import { Temporal } from '@js-temporal/polyfill';
import type { Dayjs } from 'dayjs';
import * as v from 'valibot';
import { describe, expectTypeOf, it } from 'vitest';

import type { _plainDateTimeNullable, _plainDateTimeRequired } from '#src/schemas/plain-date-time';

import { plainDateTime } from '#src/schemas/plain-date-time';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

describe('plainDateTime', () => {
  describe('nullable overload', () => {
    const schema = plainDateTime(wrongTypeMessages);

    it('returns ReturnType<typeof _plainDateTimeNullable>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _plainDateTimeNullable>>();
    });

    it('inferInput includes Temporal.PlainDateTime, Temporal.ZonedDateTime, Dayjs, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.PlainDateTime | Temporal.ZonedDateTime | Dayjs | null | undefined
      >();
    });

    it('inferOutput is Temporal.PlainDateTime | null', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.PlainDateTime | null>();
    });
  });

  describe('nullable overload - additional validation', () => {
    const schema = plainDateTime(
      wrongTypeMessages,
      v.check((val) => val.hour >= 0),
    );

    it('returns ReturnType<typeof _plainDateTimeNullable>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _plainDateTimeNullable>>();
    });

    it('inferInput includes Temporal.PlainDateTime, Temporal.ZonedDateTime, Dayjs, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.PlainDateTime | Temporal.ZonedDateTime | Dayjs | null | undefined
      >();
    });

    it('inferOutput is Temporal.PlainDateTime | null', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.PlainDateTime | null>();
    });
  });

  describe('required overload', () => {
    const schema = plainDateTime(requiredMessages);

    it('returns ReturnType<typeof _plainDateTimeRequired>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _plainDateTimeRequired>>();
    });

    it('inferInput includes Temporal.PlainDateTime, Temporal.ZonedDateTime, Dayjs, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.PlainDateTime | Temporal.ZonedDateTime | Dayjs | null | undefined
      >();
    });

    it('inferOutput is Temporal.PlainDateTime', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.PlainDateTime>();
    });
  });

  describe('required overload - additional validation', () => {
    const schema = plainDateTime(
      requiredMessages,
      v.check((val) => val.hour >= 0),
    );

    it('returns ReturnType<typeof _plainDateTimeRequired>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _plainDateTimeRequired>>();
    });

    it('inferInput includes Temporal.PlainDateTime, Temporal.ZonedDateTime, Dayjs, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.PlainDateTime | Temporal.ZonedDateTime | Dayjs | null | undefined
      >();
    });

    it('inferOutput is Temporal.PlainDateTime', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.PlainDateTime>();
    });
  });
});
