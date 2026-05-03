import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { describe, expect, it } from 'vitest';

import { dayJS } from '#src/dayjs.config';
import { zonedDateTime } from '#src/schemas/zoned-date-time';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };
const utcOptions = { timeZone: 'UTC' };

const aZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
const aValidDayJS = dayJS.utc('2024-06-15T12:00:00Z');
const anInvalidDayJS = dayJS('invalid');

describe('zonedDateTime', () => {
  describe('nullable overload', () => {
    const schema = zonedDateTime(utcOptions, wrongTypeMessages);

    it('passes null through', () => {
      expect(v.safeParse(schema, null)).toMatchObject({ success: true, output: null });
    });

    it('coerces undefined to null', () => {
      expect(v.safeParse(schema, undefined)).toMatchObject({ success: true, output: null });
    });

    it('passes a Temporal.ZonedDateTime', () => {
      expect(v.safeParse(schema, aZonedDateTime)).toMatchObject({ success: true, output: aZonedDateTime });
    });

    it('converts a valid DayJS instance to Temporal.ZonedDateTime', () => {
      const result = v.safeParse(schema, aValidDayJS);
      expect(result.success).toBeTruthy();
      expect(result.output).toEqual(Temporal.Instant.from(aValidDayJS.toISOString()).toZonedDateTimeISO('UTC'));
    });

    it('rejects an invalid DayJS instance with wrongTypeMessage', () => {
      const result = v.safeParse(schema, anInvalidDayJS);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    it('rejects strings with wrongTypeMessage', () => {
      const result = v.safeParse(schema, '2024-06-15T12:00:00+00:00[UTC]');
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    it('rejects numbers', () => {
      expect(v.safeParse(schema, 0).success).toBeFalsy();
    });

    it('rejects objects', () => {
      expect(v.safeParse(schema, {}).success).toBeFalsy();
    });

    it('rejects Temporal.Instant', () => {
      expect(v.safeParse(schema, Temporal.Instant.from('2024-06-15T00:00:00Z')).success).toBeFalsy();
    });

    it('rejects Temporal.PlainDate', () => {
      expect(v.safeParse(schema, Temporal.PlainDate.from('2024-06-15')).success).toBeFalsy();
    });

    it('passes extra zoned date-time actions', () => {
      const minZdt = Temporal.ZonedDateTime.from('2024-01-01T00:00:00+00:00[UTC]');
      const schemaWithAction = zonedDateTime(
        utcOptions,
        wrongTypeMessages,
        v.check((val) => Temporal.ZonedDateTime.compare(val, minZdt) >= 0, 'too early'),
      );
      expect(
        v.safeParse(schemaWithAction, Temporal.ZonedDateTime.from('2023-12-31T23:59:59+00:00[UTC]')).success,
      ).toBeFalsy();
      expect(v.safeParse(schemaWithAction, minZdt).success).toBeTruthy();
    });
  });

  describe('required overload', () => {
    const schema = zonedDateTime(utcOptions, requiredMessages);

    it('passes a Temporal.ZonedDateTime', () => {
      expect(v.safeParse(schema, aZonedDateTime)).toMatchObject({ success: true, output: aZonedDateTime });
    });

    it('converts a valid DayJS instance to Temporal.ZonedDateTime', () => {
      const result = v.safeParse(schema, aValidDayJS);
      expect(result.success).toBeTruthy();
      expect(result.output).toEqual(Temporal.Instant.from(aValidDayJS.toISOString()).toZonedDateTimeISO('UTC'));
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
      const result = v.safeParse(schema, '2024-06-15T12:00:00+00:00[UTC]');
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

    it('passes extra zoned date-time actions', () => {
      const minZdt = Temporal.ZonedDateTime.from('2024-01-01T00:00:00+00:00[UTC]');
      const schemaWithAction = zonedDateTime(
        utcOptions,
        requiredMessages,
        v.check((val) => Temporal.ZonedDateTime.compare(val, minZdt) >= 0, 'too early'),
      );
      expect(
        v.safeParse(schemaWithAction, Temporal.ZonedDateTime.from('2023-12-31T23:59:59+00:00[UTC]')).success,
      ).toBeFalsy();
      expect(v.safeParse(schemaWithAction, minZdt).success).toBeTruthy();
    });
  });
});
