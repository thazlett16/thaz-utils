import type { CalendarDateTime } from '@internationalized/date';
import type * as v from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { InternationalizedCalendarDateTimeSchema } from '#src/schemas/intl-calendar-date-time';
import { internationalizedCalendarDateTime } from '#src/schemas/intl-calendar-date-time';

describe('internationalizedCalendarDateTime', () => {
  const schema = internationalizedCalendarDateTime();

  test('returns InternationalizedCalendarDateTimeSchema<undefined> when no message', () => {
    expectTypeOf(schema).toEqualTypeOf<InternationalizedCalendarDateTimeSchema<undefined>>();
  });

  test('inferInput is CalendarDateTime', () => {
    expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<CalendarDateTime>();
  });

  test('inferOutput is CalendarDateTime', () => {
    expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<CalendarDateTime>();
  });
});
