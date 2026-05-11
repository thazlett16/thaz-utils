import { CalendarDate, parseZonedDateTime } from '@internationalized/date';
import * as v from 'valibot';
import { describe, expect, test } from 'vite-plus/test';

import { internationalizedZonedDateTime } from '#src/schemas/intl-zoned-date-time';

const aCalendarDate = new CalendarDate(2024, 6, 15);
const anIntlZdt = parseZonedDateTime('2024-06-15T12:00:00+00:00[UTC]');

describe('internationalizedZonedDateTime', () => {
  const schema = internationalizedZonedDateTime();

  test('passes a ZonedDateTime instance', () => {
    expect(v.safeParse(schema, anIntlZdt)).toMatchObject({ success: true, output: anIntlZdt });
  });

  test('rejects zoned datetime strings', () => {
    expect(v.safeParse(schema, '2024-06-15T12:00:00+00:00[UTC]').success).toBeFalsy();
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
