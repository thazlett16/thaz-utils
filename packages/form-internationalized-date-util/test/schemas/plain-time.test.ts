import { CalendarDateTime, Time, parseZonedDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { describe, expect, it } from 'vitest';

import { plainTime } from '#src/schemas/plain-time';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

const aPlainTime = Temporal.PlainTime.from('09:30:00');
const aZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T09:30:00+00:00[UTC]');
const aPlainDateTime = Temporal.PlainDateTime.from('2024-06-15T09:30:00');
const anIntlZdt = parseZonedDateTime('2024-06-15T09:30:00+00:00[UTC]');
const aCalendarDateTime = new CalendarDateTime(2024, 6, 15, 9, 30, 0);
const aTime = new Time(9, 30, 0);

describe('plainTime', () => {
  describe('nullable overload', () => {
    const schema = plainTime(wrongTypeMessages);

    it('passes null through', () => {
      expect(v.safeParse(schema, null)).toMatchObject({ success: true, output: null });
    });

    it('coerces undefined to null', () => {
      expect(v.safeParse(schema, undefined)).toMatchObject({ success: true, output: null });
    });

    it('passes a Temporal.PlainTime', () => {
      expect(v.safeParse(schema, aPlainTime)).toMatchObject({ success: true, output: aPlainTime });
    });

    it('converts a Temporal.ZonedDateTime to Temporal.PlainTime', () => {
      const result = v.safeParse(schema, aZonedDateTime);
      expect(result.success).toBeTruthy();
      expect(result.output).toEqual(aZonedDateTime.toPlainTime());
    });

    it('converts a Temporal.PlainDateTime to Temporal.PlainTime', () => {
      const result = v.safeParse(schema, aPlainDateTime);
      expect(result.success).toBeTruthy();
      expect(result.output).toEqual(aPlainDateTime.toPlainTime());
    });

    it('converts an @internationalized/date ZonedDateTime to Temporal.PlainTime', () => {
      const result = v.safeParse(schema, anIntlZdt);
      expect(result.success).toBeTruthy();
      expect(result.output).toEqual(Temporal.ZonedDateTime.from(anIntlZdt.toString()).toPlainTime());
    });

    it('converts an @internationalized/date CalendarDateTime to Temporal.PlainTime', () => {
      const result = v.safeParse(schema, aCalendarDateTime);
      expect(result.success).toBeTruthy();
      expect(result.output).toEqual(Temporal.PlainDateTime.from(aCalendarDateTime.toString()).toPlainTime());
    });

    it('converts an @internationalized/date Time to Temporal.PlainTime', () => {
      const result = v.safeParse(schema, aTime);
      expect(result.success).toBeTruthy();
      expect(result.output).toEqual(Temporal.PlainTime.from(aTime.toString()));
    });

    it('rejects strings with wrongTypeMessage', () => {
      const result = v.safeParse(schema, '09:30:00');
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    it('rejects numbers', () => {
      expect(v.safeParse(schema, 0).success).toBeFalsy();
    });

    it('rejects objects', () => {
      expect(v.safeParse(schema, {}).success).toBeFalsy();
    });

    it('rejects Temporal.PlainDate', () => {
      expect(v.safeParse(schema, Temporal.PlainDate.from('2024-06-15')).success).toBeFalsy();
    });

    it('rejects Temporal.Instant', () => {
      expect(v.safeParse(schema, Temporal.Instant.from('2024-06-15T00:00:00Z')).success).toBeFalsy();
    });

    it('passes extra plain time actions', () => {
      const schemaWithAction = plainTime(
        wrongTypeMessages,
        v.check((val) => val.hour >= 9, 'before 9am'),
      );
      expect(v.safeParse(schemaWithAction, Temporal.PlainTime.from('08:59:59')).success).toBeFalsy();
      expect(v.safeParse(schemaWithAction, Temporal.PlainTime.from('09:00:00')).success).toBeTruthy();
    });
  });

  describe('required overload', () => {
    const schema = plainTime(requiredMessages);

    it('passes a Temporal.PlainTime', () => {
      expect(v.safeParse(schema, aPlainTime)).toMatchObject({ success: true, output: aPlainTime });
    });

    it('converts a Temporal.ZonedDateTime to Temporal.PlainTime', () => {
      const result = v.safeParse(schema, aZonedDateTime);
      expect(result.success).toBeTruthy();
      expect(result.output).toEqual(aZonedDateTime.toPlainTime());
    });

    it('converts a Temporal.PlainDateTime to Temporal.PlainTime', () => {
      const result = v.safeParse(schema, aPlainDateTime);
      expect(result.success).toBeTruthy();
      expect(result.output).toEqual(aPlainDateTime.toPlainTime());
    });

    it('converts an @internationalized/date ZonedDateTime to Temporal.PlainTime', () => {
      const result = v.safeParse(schema, anIntlZdt);
      expect(result.success).toBeTruthy();
      expect(result.output).toEqual(Temporal.ZonedDateTime.from(anIntlZdt.toString()).toPlainTime());
    });

    it('converts an @internationalized/date CalendarDateTime to Temporal.PlainTime', () => {
      const result = v.safeParse(schema, aCalendarDateTime);
      expect(result.success).toBeTruthy();
      expect(result.output).toEqual(Temporal.PlainDateTime.from(aCalendarDateTime.toString()).toPlainTime());
    });

    it('converts an @internationalized/date Time to Temporal.PlainTime', () => {
      const result = v.safeParse(schema, aTime);
      expect(result.success).toBeTruthy();
      expect(result.output).toEqual(Temporal.PlainTime.from(aTime.toString()));
    });

    it('rejects null with requiredMessage', () => {
      const result = v.safeParse(schema, null);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Required');
    });

    it('rejects undefined with requiredMessage', () => {
      const result = v.safeParse(schema, undefined);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Required');
    });

    it('rejects strings with wrongTypeMessage', () => {
      const result = v.safeParse(schema, '09:30:00');
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    it('rejects numbers with wrongTypeMessage', () => {
      const result = v.safeParse(schema, 0);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    it('passes extra plain time actions', () => {
      const schemaWithAction = plainTime(
        requiredMessages,
        v.check((val) => val.hour >= 9, 'before 9am'),
      );
      expect(v.safeParse(schemaWithAction, Temporal.PlainTime.from('08:59:59')).success).toBeFalsy();
      expect(v.safeParse(schemaWithAction, Temporal.PlainTime.from('09:00:00')).success).toBeTruthy();
    });
  });
});
