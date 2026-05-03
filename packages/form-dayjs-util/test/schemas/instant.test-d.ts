import { Temporal } from '@js-temporal/polyfill';
import type { Dayjs } from 'dayjs';
import * as v from 'valibot';
import { describe, expectTypeOf, it } from 'vitest';

import type { _instantNullable, _instantRequired } from '#src/schemas/instant';

import { instant } from '#src/schemas/instant';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

describe('instant', () => {
  describe('nullable overload', () => {
    const schema = instant(wrongTypeMessages);

    it('returns ReturnType<typeof _instantNullable>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _instantNullable>>();
    });

    it('inferInput includes Temporal.Instant, Temporal.ZonedDateTime, Dayjs, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.Instant | Temporal.ZonedDateTime | Dayjs | null | undefined
      >();
    });

    it('inferOutput is Temporal.Instant | null', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.Instant | null>();
    });
  });

  describe('nullable overload - additional validation', () => {
    const schema = instant(
      wrongTypeMessages,
      v.check((val) => val.epochMilliseconds > 0),
    );

    it('returns ReturnType<typeof _instantNullable>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _instantNullable>>();
    });

    it('inferInput includes Temporal.Instant, Temporal.ZonedDateTime, Dayjs, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.Instant | Temporal.ZonedDateTime | Dayjs | null | undefined
      >();
    });

    it('inferOutput is Temporal.Instant | null', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.Instant | null>();
    });
  });

  describe('required overload', () => {
    const schema = instant(requiredMessages);

    it('returns ReturnType<typeof _instantRequired>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _instantRequired>>();
    });

    it('inferInput includes Temporal.Instant, Temporal.ZonedDateTime, Dayjs, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.Instant | Temporal.ZonedDateTime | Dayjs | null | undefined
      >();
    });

    it('inferOutput is Temporal.Instant', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.Instant>();
    });
  });

  describe('required overload - additional validation', () => {
    const schema = instant(
      requiredMessages,
      v.check((val) => val.epochMilliseconds > 0),
    );

    it('returns ReturnType<typeof _instantRequired>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _instantRequired>>();
    });

    it('inferInput includes Temporal.Instant, Temporal.ZonedDateTime, Dayjs, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<
        Temporal.Instant | Temporal.ZonedDateTime | Dayjs | null | undefined
      >();
    });

    it('inferOutput is Temporal.Instant', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Temporal.Instant>();
    });
  });
});
