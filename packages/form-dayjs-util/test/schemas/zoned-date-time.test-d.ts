import { Temporal } from '@js-temporal/polyfill';
import type { Dayjs } from 'dayjs';
import * as v from 'valibot';
import { describe, expectTypeOf, it } from 'vitest';

import type { _zonedDateTimeNullable, _zonedDateTimeRequired } from '#src/schemas/zoned-date-time';

import { zonedDateTime } from '#src/schemas/zoned-date-time';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };
const utcOptions = { timeZone: 'UTC' };

describe('zonedDateTime', () => {
  describe('nullable overload', () => {
    const schema = zonedDateTime(utcOptions, wrongTypeMessages);

    it('returns ReturnType<typeof _zonedDateTimeNullable>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _zonedDateTimeNullable>>();
    });

    it('inferInput includes Temporal.ZonedDateTime, Dayjs, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.ZonedDateTime | Dayjs | null | undefined
      >();
    });

    it('inferOutput is Temporal.ZonedDateTime | null', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.ZonedDateTime | null>();
    });
  });

  describe('nullable overload - additional validation', () => {
    const schema = zonedDateTime(
      utcOptions,
      wrongTypeMessages,
      v.check((val) => val.hour >= 0),
    );

    it('returns ReturnType<typeof _zonedDateTimeNullable>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _zonedDateTimeNullable>>();
    });

    it('inferInput includes Temporal.ZonedDateTime, Dayjs, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.ZonedDateTime | Dayjs | null | undefined
      >();
    });

    it('inferOutput is Temporal.ZonedDateTime | null', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.ZonedDateTime | null>();
    });
  });

  describe('required overload', () => {
    const schema = zonedDateTime(utcOptions, requiredMessages);

    it('returns ReturnType<typeof _zonedDateTimeRequired>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _zonedDateTimeRequired>>();
    });

    it('inferInput includes Temporal.ZonedDateTime, Dayjs, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.ZonedDateTime | Dayjs | null | undefined
      >();
    });

    it('inferOutput is Temporal.ZonedDateTime', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.ZonedDateTime>();
    });
  });

  describe('required overload - additional validation', () => {
    const schema = zonedDateTime(
      utcOptions,
      requiredMessages,
      v.check((val) => val.hour >= 0),
    );

    it('returns ReturnType<typeof _zonedDateTimeRequired>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _zonedDateTimeRequired>>();
    });

    it('inferInput includes Temporal.ZonedDateTime, Dayjs, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.ZonedDateTime | Dayjs | null | undefined
      >();
    });

    it('inferOutput is Temporal.ZonedDateTime', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.ZonedDateTime>();
    });
  });
});
