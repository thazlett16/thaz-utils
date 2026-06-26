import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { assert, describe, expect, test } from 'vite-plus/test';

import { toZonedDateTime } from '#src/actions/to-zoned-date-time-value';
import { dayJS } from '#src/dayjs.config';

const validDayjs = dayJS.utc('2024-06-15T12:00:00Z');
const invalidDayjs = dayJS.utc('not a date');
const aZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');

describe('toZonedDateTime', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      expect(toZonedDateTime({ timeZone: 'UTC' })).toStrictEqual({
        kind: 'transformation',
        type: 'to_zoned_date_time',
        reference: toZonedDateTime,
        async: false,
        message: undefined,
        '~run': expect.any(Function),
      });
    });

    test('with string message', () => {
      expect(toZonedDateTime({ timeZone: 'UTC' }, 'message')).toStrictEqual({
        kind: 'transformation',
        type: 'to_zoned_date_time',
        reference: toZonedDateTime,
        async: false,
        message: 'message',
        '~run': expect.any(Function),
      });
    });
  });

  describe('should transform to Temporal.ZonedDateTime', () => {
    describe('in UTC', () => {
      const schema = v.pipe(v.any(), toZonedDateTime({ timeZone: 'UTC' }));

      test('converts a Dayjs to ZonedDateTime', () => {
        const result = v.safeParse(schema, validDayjs);
        assert.isTrue(result.success);
        assert.instanceOf(result.output, Temporal.ZonedDateTime);
        expect(aZonedDateTime.equals(result.output)).toBeTruthy();
      });

      test('passes through an existing Temporal.ZonedDateTime', () => {
        const result = v.safeParse(schema, aZonedDateTime);
        assert.isTrue(result.success);
        assert.instanceOf(result.output, Temporal.ZonedDateTime);
        expect(aZonedDateTime.equals(result.output)).toBeTruthy();
      });
    });

    describe('in America/New_York', () => {
      const schema = v.pipe(v.any(), toZonedDateTime({ timeZone: 'America/New_York' }));

      test('converts a Dayjs to ZonedDateTime', () => {
        const result = v.safeParse(schema, validDayjs);
        assert.isTrue(result.success);
        assert.instanceOf(result.output, Temporal.ZonedDateTime);
        expect(result.output.timeZoneId).toBe('America/New_York');
        expect(aZonedDateTime.withTimeZone('America/New_York').equals(result.output)).toBeTruthy();
      });

      test('passes through an existing Temporal.ZonedDateTime', () => {
        const result = v.safeParse(schema, aZonedDateTime);
        assert.isTrue(result.success);
        assert.instanceOf(result.output, Temporal.ZonedDateTime);
        expect(result.output.timeZoneId).toBe('America/New_York');
        expect(aZonedDateTime.withTimeZone('America/New_York').equals(result.output)).toBeTruthy();
      });
    });

    describe('in Europe/Paris', () => {
      const schema = v.pipe(v.any(), toZonedDateTime({ timeZone: 'Europe/Paris' }));

      test('converts a Dayjs to ZonedDateTime', () => {
        const result = v.safeParse(schema, validDayjs);
        assert.isTrue(result.success);
        assert.instanceOf(result.output, Temporal.ZonedDateTime);
        expect(result.output.timeZoneId).toBe('Europe/Paris');
        expect(aZonedDateTime.withTimeZone('Europe/Paris').equals(result.output)).toBeTruthy();
      });

      test('passes through an existing Temporal.ZonedDateTime', () => {
        const result = v.safeParse(schema, aZonedDateTime);
        assert.isTrue(result.success);
        assert.instanceOf(result.output, Temporal.ZonedDateTime);
        expect(result.output.timeZoneId).toBe('Europe/Paris');
        expect(aZonedDateTime.withTimeZone('Europe/Paris').equals(result.output)).toBeTruthy();
      });
    });
  });

  describe('should return dataset with issues', () => {
    const schema = v.pipe(v.any(), toZonedDateTime({ timeZone: 'UTC' }));

    test('for invalid dayjs', () => {
      const result = v.safeParse(schema, invalidDayjs);
      expect(result.success).toBeFalsy();
    });

    test('for null', () => {
      const result = v.safeParse(schema, null);
      expect(result.success).toBeFalsy();
    });

    test('for a string', () => {
      const result = v.safeParse(schema, '2024-06-15T12:00:00Z');
      expect(result.success).toBeFalsy();
    });

    test('for a plain object', () => {
      const result = v.safeParse(schema, {});
      expect(result.success).toBeFalsy();
    });

    test('for a Temporal.Instant', () => {
      const result = v.safeParse(schema, Temporal.Instant.from('2024-06-15T12:00:00Z'));
      expect(result.success).toBeFalsy();
    });

    test('for a Temporal.PlainDate', () => {
      const result = v.safeParse(schema, Temporal.PlainDate.from('2024-06-15'));
      expect(result.success).toBeFalsy();
    });
  });
});
