import { CalendarDate, CalendarDateTime, Time } from '@internationalized/date';
import * as v from 'valibot';
import { describe, expect, test } from 'vite-plus/test';

import { internationalizedCalendarDateTime } from '#src/schemas/intl-calendar-date-time';

const aCalendarDate = new CalendarDate(2024, 6, 15);
const aCalendarDateTime = new CalendarDateTime(2024, 6, 15, 12, 30, 0);
const aTime = new Time(12, 30, 0);

describe('internationalizedCalendarDateTime', () => {
  const schema = internationalizedCalendarDateTime();

  test('passes a CalendarDateTime instance', () => {
    expect(v.safeParse(schema, aCalendarDateTime)).toMatchObject({ success: true, output: aCalendarDateTime });
  });

  test('rejects strings', () => {
    expect(v.safeParse(schema, '2024-06-15T12:30:00').success).toBeFalsy();
  });

  test('rejects numbers', () => {
    expect(v.safeParse(schema, 0).success).toBeFalsy();
  });

  test('rejects null', () => {
    expect(v.safeParse(schema, null).success).toBeFalsy();
  });

  test('rejects undefined', () => {
    expect(v.safeParse(schema, undefined).success).toBeFalsy();
  });

  test('rejects CalendarDate instances', () => {
    expect(v.safeParse(schema, aCalendarDate).success).toBeFalsy();
  });

  test('rejects Time instances', () => {
    expect(v.safeParse(schema, aTime).success).toBeFalsy();
  });
});
