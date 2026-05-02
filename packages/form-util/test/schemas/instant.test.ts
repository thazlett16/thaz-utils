import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { describe, expect, it } from 'vitest';

import { instant } from '#src/schemas/instant';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

const anInstant = Temporal.Instant.from('2024-06-15T12:00:00Z');
const aZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');

describe('instant', () => {
  describe('nullable overload', () => {
    const schema = instant(wrongTypeMessages);

    it('passes null through', () => {
      expect(v.safeParse(schema, null)).toMatchObject({ success: true, output: null });
    });

    it('coerces undefined to null', () => {
      expect(v.safeParse(schema, undefined)).toMatchObject({ success: true, output: null });
    });

    it('passes a Temporal.Instant', () => {
      expect(v.safeParse(schema, anInstant)).toMatchObject({ success: true, output: anInstant });
    });

    it('converts a Temporal.ZonedDateTime to Temporal.Instant', () => {
      const result = v.safeParse(schema, aZonedDateTime);
      expect(result.success).toBeTruthy();
      expect(result.output).toEqual(aZonedDateTime.toInstant());
    });

    it('rejects strings with wrongTypeMessage', () => {
      const result = v.safeParse(schema, '2024-06-15T12:00:00Z');
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    it('rejects numbers', () => {
      expect(v.safeParse(schema, 0).success).toBeFalsy();
    });

    it('rejects objects', () => {
      expect(v.safeParse(schema, {}).success).toBeFalsy();
    });

    it('rejects plain date types', () => {
      expect(v.safeParse(schema, Temporal.PlainDate.from('2024-06-15')).success).toBeFalsy();
    });

    it('passes extra instant actions', () => {
      const minInstant = Temporal.Instant.from('2024-01-01T00:00:00Z');
      const schemaWithAction = instant(
        wrongTypeMessages,
        v.check((val) => Temporal.Instant.compare(val, minInstant) >= 0, 'too early'),
      );
      expect(v.safeParse(schemaWithAction, Temporal.Instant.from('2023-12-31T23:59:59Z')).success).toBeFalsy();
      expect(v.safeParse(schemaWithAction, minInstant).success).toBeTruthy();
    });
  });

  describe('required overload', () => {
    const schema = instant(requiredMessages);

    it('passes a Temporal.Instant', () => {
      expect(v.safeParse(schema, anInstant)).toMatchObject({ success: true, output: anInstant });
    });

    it('converts a Temporal.ZonedDateTime to Temporal.Instant', () => {
      const result = v.safeParse(schema, aZonedDateTime);
      expect(result.success).toBeTruthy();
      expect(result.output).toEqual(aZonedDateTime.toInstant());
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
      const result = v.safeParse(schema, '2024-06-15T12:00:00Z');
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    it('rejects numbers with wrongTypeMessage', () => {
      const result = v.safeParse(schema, 0);
      expect(result.success).toBeFalsy();
      expect(result.issues?.[0]?.message).toBe('Wrong type');
    });

    it('passes extra instant actions', () => {
      const minInstant = Temporal.Instant.from('2024-01-01T00:00:00Z');
      const schemaWithAction = instant(
        requiredMessages,
        v.check((val) => Temporal.Instant.compare(val, minInstant) >= 0, 'too early'),
      );
      expect(v.safeParse(schemaWithAction, Temporal.Instant.from('2023-12-31T23:59:59Z')).success).toBeFalsy();
      expect(v.safeParse(schemaWithAction, minInstant).success).toBeTruthy();
    });
  });
});
