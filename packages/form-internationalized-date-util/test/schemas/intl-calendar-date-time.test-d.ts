import { CalendarDateTime } from '@internationalized/date';
import * as v from 'valibot';
import { describe, expectTypeOf, it } from 'vitest';

import type { InternationalizedCalendarDateTimeSchema } from '#src/schemas/intl-calendar-date-time';

import { internationalizedCalendarDateTime } from '#src/schemas/intl-calendar-date-time';

describe('internationalizedCalendarDateTime', () => {
  const schema = internationalizedCalendarDateTime();

  it('returns InternationalizedCalendarDateTimeSchema<undefined> when no message', () => {
    expectTypeOf(schema).toEqualTypeOf<InternationalizedCalendarDateTimeSchema<undefined>>();
  });

  it('inferInput is CalendarDateTime', () => {
    expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<CalendarDateTime>();
  });

  it('inferOutput is CalendarDateTime', () => {
    expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<CalendarDateTime>();
  });
});
