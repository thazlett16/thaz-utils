import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { describe, expect, it } from 'vitest';

import { dayJS } from '#src/dayjs.config';
import { plainDateTime } from '#src/schemas/plain-date-time';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

const aPlainDateTime = Temporal.PlainDateTime.from('2024-06-15T12:30:00');
const aZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T12:30:00+00:00[UTC]');
const aValidDayJS = dayJS('2024-06-15T12:30:00');
const anInvalidDayJS = dayJS('invalid');

describe('plainDateTime', () => {
  describe('nullable overload', () => {
    const schema = plainDateTime(wrongTypeMessages);

    it('passes null through', () => {
      expect(v.safeParse(schema, null)).toMatchObject({ success: true, output: null });
    });

    it('coerces undefined to null', () => {
      expect(v.safeParse(schema, undefined)).toMatchObject({ success: true, output: null });
    });

    it('passes a Temporal.PlainDateTime', () => {
      expect(v.safeParse(schema, aPlainDateTime)).toMatchObject({ success: true, output: aPlainDateTime });
    });

    it('converts a Temporal.ZonedDateTime to Temporal.PlainDateTime', () => {
      const result = v.safeParse(schema, aZonedDateTime);
      expect(result.success).toBeTruthy();
      expect(result.output).toEqual(aZonedDateTime.toPlainDateTime());
    });

    it('converts a valid DayJS instance to Temporal.PlainDateTime', () => {
      const result = v.safeParse(schema, aValidDayJS);
      expect(result.success).toBeTruthy();
      const y = aValidDayJS.year();
      const m = aValidDayJS.month() + 1;
      const d = aValidDayJS.date();
      const h = aValidDayJS.hour();
      const min = aValidDayJS.minute();
      const s = aValidDayJS.second();
      const ms = aValidDayJS.millisecond();
      expect(result.output).toEqual(new Temporal.PlainDateTime(y, m, d, h, min, s, ms));
    });

    it('rejects an invalid DayJS instance with wrongTypeMessage', () => {
      const result = v.safeParse(schema, anInvalidDayJS);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    it('rejects strings with wrongTypeMessage', () => {
      const result = v.safeParse(schema, '2024-06-15T12:30:00');
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

    it('passes extra plain date-time actions', () => {
      const schemaWithAction = plainDateTime(
        wrongTypeMessages,
        v.check((val) => val.hour >= 9, 'before business hours'),
      );
      expect(v.safeParse(schemaWithAction, Temporal.PlainDateTime.from('2024-06-15T08:00:00')).success).toBeFalsy();
      expect(v.safeParse(schemaWithAction, Temporal.PlainDateTime.from('2024-06-15T09:00:00')).success).toBeTruthy();
    });
  });

  describe('required overload', () => {
    const schema = plainDateTime(requiredMessages);

    it('passes a Temporal.PlainDateTime', () => {
      expect(v.safeParse(schema, aPlainDateTime)).toMatchObject({ success: true, output: aPlainDateTime });
    });

    it('converts a Temporal.ZonedDateTime to Temporal.PlainDateTime', () => {
      const result = v.safeParse(schema, aZonedDateTime);
      expect(result.success).toBeTruthy();
      expect(result.output).toEqual(aZonedDateTime.toPlainDateTime());
    });

    it('converts a valid DayJS instance to Temporal.PlainDateTime', () => {
      const result = v.safeParse(schema, aValidDayJS);
      expect(result.success).toBeTruthy();
      const y = aValidDayJS.year();
      const m = aValidDayJS.month() + 1;
      const d = aValidDayJS.date();
      const h = aValidDayJS.hour();
      const min = aValidDayJS.minute();
      const s = aValidDayJS.second();
      const ms = aValidDayJS.millisecond();
      expect(result.output).toEqual(new Temporal.PlainDateTime(y, m, d, h, min, s, ms));
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
      const result = v.safeParse(schema, '2024-06-15T12:30:00');
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    it('rejects numbers with wrongTypeMessage', () => {
      const result = v.safeParse(schema, 0);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    it('rejects an invalid DayJS instance with wrongTypeMessage', () => {
      const result = v.safeParse(schema, anInvalidDayJS);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    it('passes extra plain date-time actions', () => {
      const schemaWithAction = plainDateTime(
        requiredMessages,
        v.check((val) => val.hour >= 9, 'before business hours'),
      );
      expect(v.safeParse(schemaWithAction, Temporal.PlainDateTime.from('2024-06-15T08:00:00')).success).toBeFalsy();
      expect(v.safeParse(schemaWithAction, Temporal.PlainDateTime.from('2024-06-15T09:00:00')).success).toBeTruthy();
    });
  });
});
