import type { CalendarDate } from '@internationalized/date';
import type * as v from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { InternationalizedCalendarDateSchema } from '#src/schemas/intl-calendar-date';
import { internationalizedCalendarDate } from '#src/schemas/intl-calendar-date';

describe('internationalizedCalendarDate', () => {
  const schema = internationalizedCalendarDate();

  test('returns InternationalizedCalendarDateSchema<undefined> when no message', () => {
    expectTypeOf(schema).toEqualTypeOf<InternationalizedCalendarDateSchema<undefined>>();
  });

  test('inferInput is CalendarDate', () => {
    expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<CalendarDate>();
  });

  test('inferOutput is CalendarDate', () => {
    expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<CalendarDate>();
  });
});
