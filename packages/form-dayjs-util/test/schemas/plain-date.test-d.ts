import { Temporal } from '@js-temporal/polyfill';
import type { Dayjs } from 'dayjs';
import * as v from 'valibot';
import { describe, expectTypeOf, it } from 'vitest';

import type { _plainDateNullable, _plainDateRequired } from '#src/schemas/plain-date';

import { plainDate } from '#src/schemas/plain-date';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

describe('plainDate', () => {
  describe('nullable overload', () => {
    const schema = plainDate(wrongTypeMessages);

    it('returns ReturnType<typeof _plainDateNullable>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _plainDateNullable>>();
    });

    it('inferInput includes Temporal.PlainDate, Temporal.ZonedDateTime, Temporal.PlainDateTime, Dayjs, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.PlainDate | Temporal.ZonedDateTime | Temporal.PlainDateTime | Dayjs | null | undefined
      >();
    });

    it('inferOutput is Temporal.PlainDate | null', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.PlainDate | null>();
    });
  });

  describe('nullable overload - additional validation', () => {
    const schema = plainDate(
      wrongTypeMessages,
      v.check((val) => val.month > 0),
    );

    it('returns ReturnType<typeof _plainDateNullable>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _plainDateNullable>>();
    });

    it('inferInput includes Temporal.PlainDate, Temporal.ZonedDateTime, Temporal.PlainDateTime, Dayjs, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.PlainDate | Temporal.ZonedDateTime | Temporal.PlainDateTime | Dayjs | null | undefined
      >();
    });

    it('inferOutput is Temporal.PlainDate | null', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.PlainDate | null>();
    });
  });

  describe('required overload', () => {
    const schema = plainDate(requiredMessages);

    it('returns ReturnType<typeof _plainDateRequired>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _plainDateRequired>>();
    });

    it('inferInput includes Temporal.PlainDate, Temporal.ZonedDateTime, Temporal.PlainDateTime, Dayjs, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.PlainDate | Temporal.ZonedDateTime | Temporal.PlainDateTime | Dayjs | null | undefined
      >();
    });

    it('inferOutput is Temporal.PlainDate', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.PlainDate>();
    });
  });

  describe('required overload - additional validation', () => {
    const schema = plainDate(
      requiredMessages,
      v.check((val) => val.month > 0),
    );

    it('returns ReturnType<typeof _plainDateRequired>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _plainDateRequired>>();
    });

    it('inferInput includes Temporal.PlainDate, Temporal.ZonedDateTime, Temporal.PlainDateTime, Dayjs, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.PlainDate | Temporal.ZonedDateTime | Temporal.PlainDateTime | Dayjs | null | undefined
      >();
    });

    it('inferOutput is Temporal.PlainDate', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.PlainDate>();
    });
  });
});
