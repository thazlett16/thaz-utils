import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { assert, describe, expect, test } from 'vite-plus/test';

import { dayJS } from '#src/dayjs.config';
import { zonedDateTime } from '#src/schemas/zoned-date-time';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

const aZonedDateTimeUTC = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
const aZonedDateTimeNY = Temporal.ZonedDateTime.from('2024-06-15T08:00:00-04:00[America/New_York]');
const aZonedDateTimeParis = Temporal.ZonedDateTime.from('2024-06-15T14:00:00+02:00[Europe/Paris]');

const validDayjs = dayJS.utc('2024-06-15T12:00:00Z');
const invalidDayjs = dayJS('not a date');

describe('zonedDateTime', () => {
  describe('nullable overload', () => {
    describe('in UTC', () => {
      const schema = zonedDateTime({ timeZone: 'UTC' }, wrongTypeMessages);

      test('passes null through', () => {
        const result = v.safeParse(schema, null);
        assert.isTrue(result.success);
        expect(result.output).toBeNull();
      });

      test('coerces undefined to null', () => {
        const result = v.safeParse(schema, undefined);
        assert.isTrue(result.success);
        expect(result.output).toBeNull();
      });

      test('passes a Temporal.ZonedDateTime', () => {
        const result = v.safeParse(schema, aZonedDateTimeUTC);
        assert.isTrue(result.success);
        assert.isNotNull(result.output);
        assert.instanceOf(result.output, Temporal.ZonedDateTime);
        expect(aZonedDateTimeUTC.equals(result.output)).toBeTruthy();
      });

      test('converts a valid Dayjs to Temporal.ZonedDateTime in UTC', () => {
        const result = v.safeParse(schema, validDayjs);
        assert.isTrue(result.success);
        assert.isNotNull(result.output);
        assert.instanceOf(result.output, Temporal.ZonedDateTime);
        expect(result.output.timeZoneId).toBe('UTC');
        expect(aZonedDateTimeUTC.equals(result.output)).toBeTruthy();
      });

      test('passes extra zoned date-time actions', () => {
        const minZdt = Temporal.ZonedDateTime.from('2024-01-01T00:00:00+00:00[UTC]');
        const schemaWithAction = zonedDateTime(
          { timeZone: 'UTC' },
          wrongTypeMessages,
          v.check((val) => Temporal.ZonedDateTime.compare(val, minZdt) >= 0, 'too early'),
        );
        const failResult = v.safeParse(schemaWithAction, Temporal.ZonedDateTime.from('2023-12-31T23:59:59+00:00[UTC]'));
        expect(failResult.success).toBeFalsy();
        const passResult = v.safeParse(schemaWithAction, minZdt);
        expect(passResult.success).toBeTruthy();
      });

      describe('should return dataset with issues', () => {
        test('rejects an invalid Dayjs', () => {
          const result = v.safeParse(schema, invalidDayjs);
          expect(result.success).toBeFalsy();
        });

        test('rejects strings', () => {
          const result = v.safeParse(schema, '2024-06-15T12:00:00+00:00[UTC]');
          expect(result.success).toBeFalsy();
        });

        test('rejects numbers', () => {
          const result = v.safeParse(schema, 0);
          expect(result.success).toBeFalsy();
        });

        test('rejects objects', () => {
          const result = v.safeParse(schema, {});
          expect(result.success).toBeFalsy();
        });

        test('rejects Temporal.Instant', () => {
          const result = v.safeParse(schema, Temporal.Instant.from('2024-06-15T00:00:00Z'));
          expect(result.success).toBeFalsy();
        });

        test('rejects Temporal.PlainDate', () => {
          const result = v.safeParse(schema, Temporal.PlainDate.from('2024-06-15'));
          expect(result.success).toBeFalsy();
        });
      });
    });

    describe('in New_York', () => {
      const schema = zonedDateTime({ timeZone: 'America/New_York' }, wrongTypeMessages);

      test('passes null through', () => {
        const result = v.safeParse(schema, null);
        assert.isTrue(result.success);
        expect(result.output).toBeNull();
      });

      test('coerces undefined to null', () => {
        const result = v.safeParse(schema, undefined);
        assert.isTrue(result.success);
        expect(result.output).toBeNull();
      });

      test('passes a Temporal.ZonedDateTime', () => {
        const result = v.safeParse(schema, aZonedDateTimeNY);
        assert.isTrue(result.success);
        assert.isNotNull(result.output);
        assert.instanceOf(result.output, Temporal.ZonedDateTime);
        expect(aZonedDateTimeNY.equals(result.output)).toBeTruthy();
      });

      test('converts a valid Dayjs to Temporal.ZonedDateTime in America/New_York', () => {
        const result = v.safeParse(schema, validDayjs);
        assert.isTrue(result.success);
        assert.isNotNull(result.output);
        assert.instanceOf(result.output, Temporal.ZonedDateTime);
        expect(result.output.timeZoneId).toBe('America/New_York');
        expect(aZonedDateTimeNY.equals(result.output)).toBeTruthy();
      });

      test('passes extra zoned date-time actions', () => {
        const minZdt = Temporal.ZonedDateTime.from('2024-01-01T00:00:00+00:00[UTC]');
        const schemaWithAction = zonedDateTime(
          { timeZone: 'America/New_York' },
          wrongTypeMessages,
          v.check((val) => Temporal.ZonedDateTime.compare(val, minZdt) >= 0, 'too early'),
        );
        const failResult = v.safeParse(schemaWithAction, Temporal.ZonedDateTime.from('2023-12-31T23:59:59+00:00[UTC]'));
        expect(failResult.success).toBeFalsy();
        const passResult = v.safeParse(schemaWithAction, minZdt);
        expect(passResult.success).toBeTruthy();
      });

      describe('should return dataset with issues', () => {
        test('rejects an invalid Dayjs', () => {
          const result = v.safeParse(schema, invalidDayjs);
          expect(result.success).toBeFalsy();
        });

        test('rejects strings', () => {
          const result = v.safeParse(schema, '2024-06-15T12:00:00+00:00[UTC]');
          expect(result.success).toBeFalsy();
        });

        test('rejects numbers', () => {
          const result = v.safeParse(schema, 0);
          expect(result.success).toBeFalsy();
        });

        test('rejects objects', () => {
          const result = v.safeParse(schema, {});
          expect(result.success).toBeFalsy();
        });

        test('rejects Temporal.Instant', () => {
          const result = v.safeParse(schema, Temporal.Instant.from('2024-06-15T00:00:00Z'));
          expect(result.success).toBeFalsy();
        });

        test('rejects Temporal.PlainDate', () => {
          const result = v.safeParse(schema, Temporal.PlainDate.from('2024-06-15'));
          expect(result.success).toBeFalsy();
        });
      });
    });

    describe('in Paris', () => {
      const schema = zonedDateTime({ timeZone: 'Europe/Paris' }, wrongTypeMessages);

      test('passes null through', () => {
        const result = v.safeParse(schema, null);
        assert.isTrue(result.success);
        expect(result.output).toBeNull();
      });

      test('coerces undefined to null', () => {
        const result = v.safeParse(schema, undefined);
        assert.isTrue(result.success);
        expect(result.output).toBeNull();
      });

      test('passes a Temporal.ZonedDateTime', () => {
        const result = v.safeParse(schema, aZonedDateTimeParis);
        assert.isTrue(result.success);
        assert.isNotNull(result.output);
        assert.instanceOf(result.output, Temporal.ZonedDateTime);
        expect(aZonedDateTimeParis.equals(result.output)).toBeTruthy();
      });

      test('converts a valid Dayjs to Temporal.ZonedDateTime in Europe/Paris', () => {
        const result = v.safeParse(schema, validDayjs);
        assert.isTrue(result.success);
        assert.isNotNull(result.output);
        assert.instanceOf(result.output, Temporal.ZonedDateTime);
        expect(result.output.timeZoneId).toBe('Europe/Paris');
        expect(aZonedDateTimeParis.equals(result.output)).toBeTruthy();
      });

      test('passes extra zoned date-time actions', () => {
        const minZdt = Temporal.ZonedDateTime.from('2024-01-01T00:00:00+00:00[UTC]');
        const schemaWithAction = zonedDateTime(
          { timeZone: 'Europe/Paris' },
          wrongTypeMessages,
          v.check((val) => Temporal.ZonedDateTime.compare(val, minZdt) >= 0, 'too early'),
        );
        const failResult = v.safeParse(schemaWithAction, Temporal.ZonedDateTime.from('2023-12-31T23:59:59+00:00[UTC]'));
        expect(failResult.success).toBeFalsy();
        const passResult = v.safeParse(schemaWithAction, minZdt);
        expect(passResult.success).toBeTruthy();
      });

      describe('should return dataset with issues', () => {
        test('rejects an invalid Dayjs', () => {
          const result = v.safeParse(schema, invalidDayjs);
          expect(result.success).toBeFalsy();
        });

        test('rejects strings', () => {
          const result = v.safeParse(schema, '2024-06-15T12:00:00+00:00[UTC]');
          expect(result.success).toBeFalsy();
        });

        test('rejects numbers', () => {
          const result = v.safeParse(schema, 0);
          expect(result.success).toBeFalsy();
        });

        test('rejects objects', () => {
          const result = v.safeParse(schema, {});
          expect(result.success).toBeFalsy();
        });

        test('rejects Temporal.Instant', () => {
          const result = v.safeParse(schema, Temporal.Instant.from('2024-06-15T00:00:00Z'));
          expect(result.success).toBeFalsy();
        });

        test('rejects Temporal.PlainDate', () => {
          const result = v.safeParse(schema, Temporal.PlainDate.from('2024-06-15'));
          expect(result.success).toBeFalsy();
        });
      });
    });
  });

  describe('required overload', () => {
    describe('in UTC', () => {
      const schema = zonedDateTime({ timeZone: 'UTC' }, requiredMessages);

      test('passes a Temporal.ZonedDateTime', () => {
        const result = v.safeParse(schema, aZonedDateTimeUTC);
        assert.isTrue(result.success);
        assert.isNotNull(result.output);
        assert.instanceOf(result.output, Temporal.ZonedDateTime);
        expect(aZonedDateTimeUTC.equals(result.output)).toBeTruthy();
      });

      test('converts a valid Dayjs to Temporal.ZonedDateTime in UTC', () => {
        const result = v.safeParse(schema, validDayjs);
        assert.isTrue(result.success);
        assert.isNotNull(result.output);
        assert.instanceOf(result.output, Temporal.ZonedDateTime);
        expect(result.output.timeZoneId).toBe('UTC');
        expect(aZonedDateTimeUTC.equals(result.output)).toBeTruthy();
      });

      test('passes extra zoned date-time actions', () => {
        const minZdt = Temporal.ZonedDateTime.from('2024-01-01T00:00:00+00:00[UTC]');
        const schemaWithAction = zonedDateTime(
          { timeZone: 'UTC' },
          wrongTypeMessages,
          v.check((val) => Temporal.ZonedDateTime.compare(val, minZdt) >= 0, 'too early'),
        );
        const failResult = v.safeParse(schemaWithAction, Temporal.ZonedDateTime.from('2023-12-31T23:59:59+00:00[UTC]'));
        expect(failResult.success).toBeFalsy();
        const passResult = v.safeParse(schemaWithAction, minZdt);
        expect(passResult.success).toBeTruthy();
      });

      describe('should return dataset with issues', () => {
        test('rejects null', () => {
          const result = v.safeParse(schema, null);
          expect(result.success).toBeFalsy();
        });

        test('rejects undefined', () => {
          const result = v.safeParse(schema, undefined);
          expect(result.success).toBeFalsy();
        });

        test('rejects an invalid Dayjs', () => {
          const result = v.safeParse(schema, invalidDayjs);
          expect(result.success).toBeFalsy();
        });

        test('rejects strings', () => {
          const result = v.safeParse(schema, '2024-06-15T12:00:00+00:00[UTC]');
          expect(result.success).toBeFalsy();
        });

        test('rejects numbers', () => {
          const result = v.safeParse(schema, 0);
          expect(result.success).toBeFalsy();
        });

        test('rejects objects', () => {
          const result = v.safeParse(schema, {});
          expect(result.success).toBeFalsy();
        });

        test('rejects Temporal.Instant', () => {
          const result = v.safeParse(schema, Temporal.Instant.from('2024-06-15T00:00:00Z'));
          expect(result.success).toBeFalsy();
        });

        test('rejects Temporal.PlainDate', () => {
          const result = v.safeParse(schema, Temporal.PlainDate.from('2024-06-15'));
          expect(result.success).toBeFalsy();
        });
      });
    });

    describe('in New_York', () => {
      const schema = zonedDateTime({ timeZone: 'America/New_York' }, requiredMessages);

      test('passes a Temporal.ZonedDateTime', () => {
        const result = v.safeParse(schema, aZonedDateTimeNY);
        assert.isTrue(result.success);
        assert.isNotNull(result.output);
        assert.instanceOf(result.output, Temporal.ZonedDateTime);
        expect(aZonedDateTimeNY.equals(result.output)).toBeTruthy();
      });

      test('converts a valid Dayjs to Temporal.ZonedDateTime in America/New_York', () => {
        const result = v.safeParse(schema, validDayjs);
        assert.isTrue(result.success);
        assert.isNotNull(result.output);
        assert.instanceOf(result.output, Temporal.ZonedDateTime);
        expect(result.output.timeZoneId).toBe('America/New_York');
        expect(aZonedDateTimeNY.equals(result.output)).toBeTruthy();
      });

      test('passes extra zoned date-time actions', () => {
        const minZdt = Temporal.ZonedDateTime.from('2024-01-01T00:00:00+00:00[UTC]');
        const schemaWithAction = zonedDateTime(
          { timeZone: 'America/New_York' },
          wrongTypeMessages,
          v.check((val) => Temporal.ZonedDateTime.compare(val, minZdt) >= 0, 'too early'),
        );
        const failResult = v.safeParse(schemaWithAction, Temporal.ZonedDateTime.from('2023-12-31T23:59:59+00:00[UTC]'));
        expect(failResult.success).toBeFalsy();
        const passResult = v.safeParse(schemaWithAction, minZdt);
        expect(passResult.success).toBeTruthy();
      });

      describe('should return dataset with issues', () => {
        test('rejects null', () => {
          const result = v.safeParse(schema, null);
          expect(result.success).toBeFalsy();
        });

        test('rejects undefined', () => {
          const result = v.safeParse(schema, undefined);
          expect(result.success).toBeFalsy();
        });

        test('rejects an invalid Dayjs', () => {
          const result = v.safeParse(schema, invalidDayjs);
          expect(result.success).toBeFalsy();
        });

        test('rejects strings', () => {
          const result = v.safeParse(schema, '2024-06-15T12:00:00+00:00[UTC]');
          expect(result.success).toBeFalsy();
        });

        test('rejects numbers', () => {
          const result = v.safeParse(schema, 0);
          expect(result.success).toBeFalsy();
        });

        test('rejects objects', () => {
          const result = v.safeParse(schema, {});
          expect(result.success).toBeFalsy();
        });

        test('rejects Temporal.Instant', () => {
          const result = v.safeParse(schema, Temporal.Instant.from('2024-06-15T00:00:00Z'));
          expect(result.success).toBeFalsy();
        });

        test('rejects Temporal.PlainDate', () => {
          const result = v.safeParse(schema, Temporal.PlainDate.from('2024-06-15'));
          expect(result.success).toBeFalsy();
        });
      });
    });

    describe('in Paris', () => {
      const schema = zonedDateTime({ timeZone: 'Europe/Paris' }, requiredMessages);

      test('passes a Temporal.ZonedDateTime', () => {
        const result = v.safeParse(schema, aZonedDateTimeParis);
        assert.isTrue(result.success);
        assert.isNotNull(result.output);
        assert.instanceOf(result.output, Temporal.ZonedDateTime);
        expect(aZonedDateTimeParis.equals(result.output)).toBeTruthy();
      });

      test('converts a valid Dayjs to Temporal.ZonedDateTime in Europe/Paris', () => {
        const result = v.safeParse(schema, validDayjs);
        assert.isTrue(result.success);
        assert.isNotNull(result.output);
        assert.instanceOf(result.output, Temporal.ZonedDateTime);
        expect(result.output.timeZoneId).toBe('Europe/Paris');
        expect(aZonedDateTimeParis.equals(result.output)).toBeTruthy();
      });

      test('passes extra zoned date-time actions', () => {
        const minZdt = Temporal.ZonedDateTime.from('2024-01-01T00:00:00+00:00[UTC]');
        const schemaWithAction = zonedDateTime(
          { timeZone: 'Europe/Paris' },
          wrongTypeMessages,
          v.check((val) => Temporal.ZonedDateTime.compare(val, minZdt) >= 0, 'too early'),
        );
        const failResult = v.safeParse(schemaWithAction, Temporal.ZonedDateTime.from('2023-12-31T23:59:59+00:00[UTC]'));
        expect(failResult.success).toBeFalsy();
        const passResult = v.safeParse(schemaWithAction, minZdt);
        expect(passResult.success).toBeTruthy();
      });

      describe('should return dataset with issues', () => {
        test('rejects null', () => {
          const result = v.safeParse(schema, null);
          expect(result.success).toBeFalsy();
        });

        test('rejects undefined', () => {
          const result = v.safeParse(schema, undefined);
          expect(result.success).toBeFalsy();
        });

        test('rejects an invalid Dayjs', () => {
          const result = v.safeParse(schema, invalidDayjs);
          expect(result.success).toBeFalsy();
        });

        test('rejects strings', () => {
          const result = v.safeParse(schema, '2024-06-15T12:00:00+00:00[UTC]');
          expect(result.success).toBeFalsy();
        });

        test('rejects numbers', () => {
          const result = v.safeParse(schema, 0);
          expect(result.success).toBeFalsy();
        });

        test('rejects objects', () => {
          const result = v.safeParse(schema, {});
          expect(result.success).toBeFalsy();
        });

        test('rejects Temporal.Instant', () => {
          const result = v.safeParse(schema, Temporal.Instant.from('2024-06-15T00:00:00Z'));
          expect(result.success).toBeFalsy();
        });

        test('rejects Temporal.PlainDate', () => {
          const result = v.safeParse(schema, Temporal.PlainDate.from('2024-06-15'));
          expect(result.success).toBeFalsy();
        });
      });
    });
  });
});
