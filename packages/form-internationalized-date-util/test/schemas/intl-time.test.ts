import { CalendarDate, Time } from '@internationalized/date';
import * as v from 'valibot';
import { describe, expect, test } from 'vite-plus/test';

import { internationalizedTime } from '#src/schemas/intl-time';

const aCalendarDate = new CalendarDate(2024, 6, 15);
const aTime = new Time(12, 30, 0);

describe('internationalizedTime', () => {
  const schema = internationalizedTime();

  test('passes a Time instance', () => {
    expect(v.safeParse(schema, aTime)).toMatchObject({ success: true, output: aTime });
  });

  test('rejects strings', () => {
    expect(v.safeParse(schema, '12:30:00').success).toBeFalsy();
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
});
