import type { Temporal } from '@js-temporal/polyfill';
import type { InferInput, InferIssue, InferOutput } from 'valibot';

import { describe, expectTypeOf, it } from 'vitest';

import type { ZonedDateTimeIssue, ZonedDateTimeSchema } from '#src/schema/zoned-date-time';

import { zonedDateTime } from '#src/schema/zoned-date-time';

describe('zonedDateTime', () => {
  describe('should return schema object', () => {
    it('with undefined message', () => {
      type Schema = ZonedDateTimeSchema<undefined>;
      expectTypeOf(zonedDateTime()).toEqualTypeOf<Schema>();
      expectTypeOf(zonedDateTime(undefined)).toEqualTypeOf<Schema>();
    });

    it('with string message', () => {
      expectTypeOf(zonedDateTime('message')).toEqualTypeOf<ZonedDateTimeSchema<'message'>>();
    });

    it('with function message', () => {
      expectTypeOf(zonedDateTime(() => 'message')).toEqualTypeOf<ZonedDateTimeSchema<() => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Schema = ZonedDateTimeSchema<undefined>;

    it('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<Temporal.ZonedDateTime>();
    });

    it('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<Temporal.ZonedDateTime>();
    });

    it('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<ZonedDateTimeIssue>();
    });
  });
});
