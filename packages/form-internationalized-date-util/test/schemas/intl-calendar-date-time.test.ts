import { CalendarDate, CalendarDateTime, Time } from '@internationalized/date';
import * as v from 'valibot';
import { describe, expect, it } from 'vitest';

import { internationalizedCalendarDateTime } from '#src/schemas/intl-calendar-date-time';

const aCalendarDate = new CalendarDate(2024, 6, 15);
const aCalendarDateTime = new CalendarDateTime(2024, 6, 15, 12, 30, 0);
const aTime = new Time(12, 30, 0);

describe('internationalizedCalendarDateTime', () => {
  const schema = internationalizedCalendarDateTime();

  it('passes a CalendarDateTime instance', () => {
    expect(v.safeParse(schema, aCalendarDateTime)).toMatchObject({ success: true, output: aCalendarDateTime });
  });

  it('rejects strings', () => {
    expect(v.safeParse(schema, '2024-06-15T12:30:00').success).toBeFalsy();
  });

  it('rejects numbers', () => {
    expect(v.safeParse(schema, 0).success).toBeFalsy();
  });

  it('rejects null', () => {
    expect(v.safeParse(schema, null).success).toBeFalsy();
  });

  it('rejects undefined', () => {
    expect(v.safeParse(schema, undefined).success).toBeFalsy();
  });

  it('rejects CalendarDate instances', () => {
    expect(v.safeParse(schema, aCalendarDate).success).toBeFalsy();
  });

  it('rejects Time instances', () => {
    expect(v.safeParse(schema, aTime).success).toBeFalsy();
  });
});
