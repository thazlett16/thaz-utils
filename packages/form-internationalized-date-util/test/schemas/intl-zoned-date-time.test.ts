import { CalendarDate, parseZonedDateTime } from '@internationalized/date';
import * as v from 'valibot';
import { describe, expect, it } from 'vitest';

import { internationalizedZonedDateTime } from '#src/schemas/intl-zoned-date-time';

const aCalendarDate = new CalendarDate(2024, 6, 15);
const anIntlZdt = parseZonedDateTime('2024-06-15T12:00:00+00:00[UTC]');

describe('internationalizedZonedDateTime', () => {
  const schema = internationalizedZonedDateTime();

  it('passes a ZonedDateTime instance', () => {
    expect(v.safeParse(schema, anIntlZdt)).toMatchObject({ success: true, output: anIntlZdt });
  });

  it('rejects zoned datetime strings', () => {
    expect(v.safeParse(schema, '2024-06-15T12:00:00+00:00[UTC]').success).toBeFalsy();
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
});
