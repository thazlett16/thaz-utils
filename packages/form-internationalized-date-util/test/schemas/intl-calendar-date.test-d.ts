import { CalendarDate } from '@internationalized/date';
import * as v from 'valibot';
import { describe, expectTypeOf, it } from 'vitest';

import type { InternationalizedCalendarDateSchema } from '#src/schemas/intl-calendar-date';

import { internationalizedCalendarDate } from '#src/schemas/intl-calendar-date';

describe('internationalizedCalendarDate', () => {
  const schema = internationalizedCalendarDate();

  it('returns InternationalizedCalendarDateSchema<undefined> when no message', () => {
    expectTypeOf(schema).toEqualTypeOf<InternationalizedCalendarDateSchema<undefined>>();
  });

  it('inferInput is CalendarDate', () => {
    expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<CalendarDate>();
  });

  it('inferOutput is CalendarDate', () => {
    expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<CalendarDate>();
  });
});
