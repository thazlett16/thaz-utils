import { CalendarDate, Time } from '@internationalized/date';
import * as v from 'valibot';
import { describe, expect, it } from 'vitest';

import { internationalizedTime } from '#src/schemas/intl-time';

const aCalendarDate = new CalendarDate(2024, 6, 15);
const aTime = new Time(12, 30, 0);

describe('internationalizedTime', () => {
  const schema = internationalizedTime();

  it('passes a Time instance', () => {
    expect(v.safeParse(schema, aTime)).toMatchObject({ success: true, output: aTime });
  });

  it('rejects strings', () => {
    expect(v.safeParse(schema, '12:30:00').success).toBeFalsy();
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
