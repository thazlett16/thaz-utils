import type { Temporal } from '@js-temporal/polyfill';
import type { Dayjs } from 'dayjs';
import * as v from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { _plainDateNullable, _plainDateRequired } from '#src/schemas/plain-date';
import { plainDate } from '#src/schemas/plain-date';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

describe('plainDate', () => {
  describe('nullable overload', () => {
    const schema = plainDate(wrongTypeMessages);

    test('returns ReturnType<typeof _plainDateNullable>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _plainDateNullable>>();
    });

    test('inferInput includes Temporal.PlainDate, Temporal.ZonedDateTime, Temporal.PlainDateTime, Dayjs, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.PlainDate | Temporal.ZonedDateTime | Temporal.PlainDateTime | Dayjs | null | undefined
      >();
    });

    test('inferOutput is Temporal.PlainDate | null', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.PlainDate | null>();
    });
  });

  describe('nullable overload - additional validation', () => {
    const schema = plainDate(
      wrongTypeMessages,
      v.check((val) => val.month > 0),
    );

    test('returns ReturnType<typeof _plainDateNullable>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _plainDateNullable>>();
    });

    test('inferInput includes Temporal.PlainDate, Temporal.ZonedDateTime, Temporal.PlainDateTime, Dayjs, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.PlainDate | Temporal.ZonedDateTime | Temporal.PlainDateTime | Dayjs | null | undefined
      >();
    });

    test('inferOutput is Temporal.PlainDate | null', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.PlainDate | null>();
    });
  });

  describe('required overload', () => {
    const schema = plainDate(requiredMessages);

    test('returns ReturnType<typeof _plainDateRequired>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _plainDateRequired>>();
    });

    test('inferInput includes Temporal.PlainDate, Temporal.ZonedDateTime, Temporal.PlainDateTime, Dayjs, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.PlainDate | Temporal.ZonedDateTime | Temporal.PlainDateTime | Dayjs | null | undefined
      >();
    });

    test('inferOutput is Temporal.PlainDate', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.PlainDate>();
    });
  });

  describe('required overload - additional validation', () => {
    const schema = plainDate(
      requiredMessages,
      v.check((val) => val.month > 0),
    );

    test('returns ReturnType<typeof _plainDateRequired>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _plainDateRequired>>();
    });

    test('inferInput includes Temporal.PlainDate, Temporal.ZonedDateTime, Temporal.PlainDateTime, Dayjs, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.PlainDate | Temporal.ZonedDateTime | Temporal.PlainDateTime | Dayjs | null | undefined
      >();
    });

    test('inferOutput is Temporal.PlainDate', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.PlainDate>();
    });
  });
});
