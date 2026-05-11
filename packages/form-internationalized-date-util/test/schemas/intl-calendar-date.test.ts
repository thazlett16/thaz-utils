import { CalendarDate, CalendarDateTime, Time } from '@internationalized/date';
import * as v from 'valibot';
import { describe, expect, test } from 'vite-plus/test';

import { internationalizedCalendarDate } from '#src/schemas/intl-calendar-date';

const aCalendarDate = new CalendarDate(2024, 6, 15);
const aCalendarDateTime = new CalendarDateTime(2024, 6, 15, 12, 30, 0);
const aTime = new Time(12, 30, 0);

describe('internationalizedCalendarDate', () => {
  const schema = internationalizedCalendarDate();

  test('passes a CalendarDate instance', () => {
    expect(v.safeParse(schema, aCalendarDate)).toMatchObject({ success: true, output: aCalendarDate });
  });

  test('rejects strings', () => {
    expect(v.safeParse(schema, '2024-06-15').success).toBeFalsy();
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

  test('rejects CalendarDateTime instances', () => {
    expect(v.safeParse(schema, aCalendarDateTime).success).toBeFalsy();
  });

  test('rejects Time instances', () => {
    expect(v.safeParse(schema, aTime).success).toBeFalsy();
  });
});
