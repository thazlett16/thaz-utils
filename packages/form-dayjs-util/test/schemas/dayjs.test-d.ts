import type { Dayjs } from 'dayjs';
import * as v from 'valibot';
import { describe, expectTypeOf, it } from 'vitest';

import type { DayJSSchema } from '#src/schemas/dayjs';

import { dayjs } from '#src/schemas/dayjs';

describe('dayjs', () => {
  describe('no message', () => {
    const schema = dayjs();

    it('returns DayJSSchema<undefined>', () => {
      expectTypeOf(schema).toEqualTypeOf<DayJSSchema<undefined>>();
    });

    it('inferInput is Dayjs', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<Dayjs>();
    });

    it('inferOutput is Dayjs', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Dayjs>();
    });
  });

  describe('string message', () => {
    const schema = dayjs('Invalid DayJS value');

    it('returns DayJSSchema<"Invalid DayJS value">', () => {
      expectTypeOf(schema).toEqualTypeOf<DayJSSchema<'Invalid DayJS value'>>();
    });

    it('inferInput is Dayjs', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<Dayjs>();
    });

    it('inferOutput is Dayjs', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Dayjs>();
    });
  });
});
