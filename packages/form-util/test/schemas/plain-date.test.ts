import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { describe, expect, it } from 'vitest';

import { plainDate } from '#src/schemas/plain-date';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

const aPlainDate = Temporal.PlainDate.from('2024-06-15');
const aZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
const aPlainDateTime = Temporal.PlainDateTime.from('2024-06-15T12:00:00');

describe('plainDate', () => {
  describe('nullable overload', () => {
    const schema = plainDate(wrongTypeMessages);

    it('passes null through', () => {
      expect(v.safeParse(schema, null)).toMatchObject({ success: true, output: null });
    });

    it('coerces undefined to null', () => {
      expect(v.safeParse(schema, undefined)).toMatchObject({ success: true, output: null });
    });

    it('passes a Temporal.PlainDate', () => {
      expect(v.safeParse(schema, aPlainDate)).toMatchObject({ success: true, output: aPlainDate });
    });

    it('converts a Temporal.ZonedDateTime to Temporal.PlainDate', () => {
      const result = v.safeParse(schema, aZonedDateTime);
      expect(result.success).toBeTruthy();
      expect(result.output).toEqual(aZonedDateTime.toPlainDate());
    });

    it('converts a Temporal.PlainDateTime to Temporal.PlainDate', () => {
      const result = v.safeParse(schema, aPlainDateTime);
      expect(result.success).toBeTruthy();
      expect(result.output).toEqual(aPlainDateTime.toPlainDate());
    });

    it('rejects strings with wrongTypeMessage', () => {
      const result = v.safeParse(schema, '2024-06-15');
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

    it('passes extra plain date actions', () => {
      const minDate = Temporal.PlainDate.from('2024-01-01');
      const schemaWithAction = plainDate(
        wrongTypeMessages,
        v.check((val) => Temporal.PlainDate.compare(val, minDate) >= 0, 'too early'),
      );
      expect(v.safeParse(schemaWithAction, Temporal.PlainDate.from('2023-12-31')).success).toBeFalsy();
      expect(v.safeParse(schemaWithAction, minDate).success).toBeTruthy();
    });
  });

  describe('required overload', () => {
    const schema = plainDate(requiredMessages);

    it('passes a Temporal.PlainDate', () => {
      expect(v.safeParse(schema, aPlainDate)).toMatchObject({ success: true, output: aPlainDate });
    });

    it('converts a Temporal.ZonedDateTime to Temporal.PlainDate', () => {
      const result = v.safeParse(schema, aZonedDateTime);
      expect(result.success).toBeTruthy();
      expect(result.output).toEqual(aZonedDateTime.toPlainDate());
    });

    it('converts a Temporal.PlainDateTime to Temporal.PlainDate', () => {
      const result = v.safeParse(schema, aPlainDateTime);
      expect(result.success).toBeTruthy();
      expect(result.output).toEqual(aPlainDateTime.toPlainDate());
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
      const result = v.safeParse(schema, '2024-06-15');
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    it('rejects numbers with wrongTypeMessage', () => {
      const result = v.safeParse(schema, 0);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    it('passes extra plain date actions', () => {
      const minDate = Temporal.PlainDate.from('2024-01-01');
      const schemaWithAction = plainDate(
        requiredMessages,
        v.check((val) => Temporal.PlainDate.compare(val, minDate) >= 0, 'too early'),
      );
      expect(v.safeParse(schemaWithAction, Temporal.PlainDate.from('2023-12-31')).success).toBeFalsy();
      expect(v.safeParse(schemaWithAction, minDate).success).toBeTruthy();
    });
  });
});
