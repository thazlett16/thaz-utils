import { CalendarDateTime, Time, parseZonedDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { describe, expect, test } from 'vite-plus/test';

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

    test('passes null through', () => {
      expect(v.safeParse(schema, null)).toMatchObject({ success: true, output: null });
    });

    test('coerces undefined to null', () => {
      expect(v.safeParse(schema, undefined)).toMatchObject({ success: true, output: null });
    });

    test('passes a Temporal.PlainTime', () => {
      expect(v.safeParse(schema, aPlainTime)).toMatchObject({ success: true, output: aPlainTime });
    });

    test('converts a Temporal.ZonedDateTime to Temporal.PlainTime', () => {
      const result = v.safeParse(schema, aZonedDateTime);
      expect(result.success).toBeTruthy();
      expect(result.output).toStrictEqual(aZonedDateTime.toPlainTime());
    });

    test('converts a Temporal.PlainDateTime to Temporal.PlainTime', () => {
      const result = v.safeParse(schema, aPlainDateTime);
      expect(result.success).toBeTruthy();
      expect(result.output).toStrictEqual(aPlainDateTime.toPlainTime());
    });

    test('converts an @internationalized/date ZonedDateTime to Temporal.PlainTime', () => {
      const result = v.safeParse(schema, anIntlZdt);
      expect(result.success).toBeTruthy();
      expect(result.output).toStrictEqual(Temporal.ZonedDateTime.from(anIntlZdt.toString()).toPlainTime());
    });

    test('converts an @internationalized/date CalendarDateTime to Temporal.PlainTime', () => {
      const result = v.safeParse(schema, aCalendarDateTime);
      expect(result.success).toBeTruthy();
      expect(result.output).toStrictEqual(Temporal.PlainDateTime.from(aCalendarDateTime.toString()).toPlainTime());
    });

    test('converts an @internationalized/date Time to Temporal.PlainTime', () => {
      const result = v.safeParse(schema, aTime);
      expect(result.success).toBeTruthy();
      expect(result.output).toStrictEqual(Temporal.PlainTime.from(aTime.toString()));
    });

    test('rejects strings with wrongTypeMessage', () => {
      const result = v.safeParse(schema, '09:30:00');
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    test('rejects numbers', () => {
      expect(v.safeParse(schema, 0).success).toBeFalsy();
    });

    test('rejects objects', () => {
      expect(v.safeParse(schema, {}).success).toBeFalsy();
    });

    test('rejects Temporal.PlainDate', () => {
      expect(v.safeParse(schema, Temporal.PlainDate.from('2024-06-15')).success).toBeFalsy();
    });

    test('rejects Temporal.Instant', () => {
      expect(v.safeParse(schema, Temporal.Instant.from('2024-06-15T00:00:00Z')).success).toBeFalsy();
    });

    test('passes extra plain time actions', () => {
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

    test('passes a Temporal.PlainTime', () => {
      expect(v.safeParse(schema, aPlainTime)).toMatchObject({ success: true, output: aPlainTime });
    });

    test('converts a Temporal.ZonedDateTime to Temporal.PlainTime', () => {
      const result = v.safeParse(schema, aZonedDateTime);
      expect(result.success).toBeTruthy();
      expect(result.output).toStrictEqual(aZonedDateTime.toPlainTime());
    });

    test('converts a Temporal.PlainDateTime to Temporal.PlainTime', () => {
      const result = v.safeParse(schema, aPlainDateTime);
      expect(result.success).toBeTruthy();
      expect(result.output).toStrictEqual(aPlainDateTime.toPlainTime());
    });

    test('converts an @internationalized/date ZonedDateTime to Temporal.PlainTime', () => {
      const result = v.safeParse(schema, anIntlZdt);
      expect(result.success).toBeTruthy();
      expect(result.output).toStrictEqual(Temporal.ZonedDateTime.from(anIntlZdt.toString()).toPlainTime());
    });

    test('converts an @internationalized/date CalendarDateTime to Temporal.PlainTime', () => {
      const result = v.safeParse(schema, aCalendarDateTime);
      expect(result.success).toBeTruthy();
      expect(result.output).toStrictEqual(Temporal.PlainDateTime.from(aCalendarDateTime.toString()).toPlainTime());
    });

    test('converts an @internationalized/date Time to Temporal.PlainTime', () => {
      const result = v.safeParse(schema, aTime);
      expect(result.success).toBeTruthy();
      expect(result.output).toStrictEqual(Temporal.PlainTime.from(aTime.toString()));
    });

    test('rejects null with requiredMessage', () => {
      const result = v.safeParse(schema, null);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Required');
    });

    test('rejects undefined with requiredMessage', () => {
      const result = v.safeParse(schema, undefined);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Required');
    });

    test('rejects strings with wrongTypeMessage', () => {
      const result = v.safeParse(schema, '09:30:00');
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    test('rejects numbers with wrongTypeMessage', () => {
      const result = v.safeParse(schema, 0);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    test('passes extra plain time actions', () => {
      const schemaWithAction = plainTime(
        requiredMessages,
        v.check((val) => val.hour >= 9, 'before 9am'),
      );
      expect(v.safeParse(schemaWithAction, Temporal.PlainTime.from('08:59:59')).success).toBeFalsy();
      expect(v.safeParse(schemaWithAction, Temporal.PlainTime.from('09:00:00')).success).toBeTruthy();
    });
  });
});
