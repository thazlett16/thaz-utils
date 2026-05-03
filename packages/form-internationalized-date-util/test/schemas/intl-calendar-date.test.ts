import { CalendarDate, CalendarDateTime, Time } from '@internationalized/date';
import * as v from 'valibot';
import { describe, expect, it } from 'vitest';

import { internationalizedCalendarDate } from '#src/schemas/intl-calendar-date';

const aCalendarDate = new CalendarDate(2024, 6, 15);
const aCalendarDateTime = new CalendarDateTime(2024, 6, 15, 12, 30, 0);
const aTime = new Time(12, 30, 0);

describe('internationalizedCalendarDate', () => {
  const schema = internationalizedCalendarDate();

  it('passes a CalendarDate instance', () => {
    expect(v.safeParse(schema, aCalendarDate)).toMatchObject({ success: true, output: aCalendarDate });
  });

  it('rejects strings', () => {
    expect(v.safeParse(schema, '2024-06-15').success).toBeFalsy();
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

  it('rejects CalendarDateTime instances', () => {
    expect(v.safeParse(schema, aCalendarDateTime).success).toBeFalsy();
  });

  it('rejects Time instances', () => {
    expect(v.safeParse(schema, aTime).success).toBeFalsy();
  });
});
