import type { Dayjs } from 'dayjs';
import type * as v from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { DayJSSchema } from '#src/schemas/dayjs';
import { dayjs } from '#src/schemas/dayjs';

describe('dayjs', () => {
  describe('no message', () => {
    const schema = dayjs();

    test('returns DayJSSchema<undefined>', () => {
      expectTypeOf(schema).toEqualTypeOf<DayJSSchema<undefined>>();
    });

    test('inferInput is Dayjs', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<Dayjs>();
    });

    test('inferOutput is Dayjs', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Dayjs>();
    });
  });

  describe('string message', () => {
    const schema = dayjs('Invalid DayJS value');

    test('returns DayJSSchema<"Invalid DayJS value">', () => {
      expectTypeOf(schema).toEqualTypeOf<DayJSSchema<'Invalid DayJS value'>>();
    });

    test('inferInput is Dayjs', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<Dayjs>();
    });

    test('inferOutput is Dayjs', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Dayjs>();
    });
  });
});
