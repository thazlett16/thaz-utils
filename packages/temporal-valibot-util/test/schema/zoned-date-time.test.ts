import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vitest';

import type { ZonedDateTimeIssue, ZonedDateTimeSchema } from '#src/schema/zoned-date-time';

import { zonedDateTime } from '#src/schema/zoned-date-time';

describe('zonedDateTime', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<ZonedDateTimeSchema<never>, 'message'> = {
      kind: 'schema',
      type: 'zoned_date_time',
      reference: zonedDateTime,
      expects: 'Temporal.ZonedDateTime',
      async: false,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    it('with undefined message', () => {
      const schema: ZonedDateTimeSchema<undefined> = { ...baseSchema, message: undefined };
      expect(zonedDateTime()).toStrictEqual(schema);
      expect(zonedDateTime(undefined)).toStrictEqual(schema);
    });

    it('with string message', () => {
      expect(zonedDateTime('message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies ZonedDateTimeSchema<string>);
    });

    it('with function message', () => {
      const message = () => 'message';
      expect(zonedDateTime(message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies ZonedDateTimeSchema<typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = zonedDateTime();

    it('for UTC zoned date-time', () => {
      const value = Temporal.ZonedDateTime.from('2024-01-01T00:00:00+00:00[UTC]');
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });

    it('for named timezone', () => {
      const value = Temporal.ZonedDateTime.from('2024-06-15T12:30:00-05:00[America/Chicago]');
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });

    it('for positive offset timezone', () => {
      const value = Temporal.ZonedDateTime.from('2024-01-01T09:00:00+09:00[Asia/Tokyo]');
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const schema = zonedDateTime('message');
    const baseIssue: Omit<ZonedDateTimeIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'zoned_date_time',
      expected: 'Temporal.ZonedDateTime',
      message: 'message',
      requirement: undefined,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    it('for null', () => {
      expect(schema['~run']({ value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
        issues: [{ ...baseIssue, input: null, received: 'null' }],
      });
    });

    it('for undefined', () => {
      expect(schema['~run']({ value: undefined }, {})).toStrictEqual({
        typed: false,
        value: undefined,
        issues: [{ ...baseIssue, input: undefined, received: 'undefined' }],
      });
    });

    it('for zoned datetime strings', () => {
      const str = '2024-01-01T00:00:00+00:00[UTC]';
      expect(schema['~run']({ value: str }, {})).toStrictEqual({
        typed: false,
        value: str,
        issues: [{ ...baseIssue, input: str, received: `"${str}"` }],
      });
    });

    it('for numbers', () => {
      expect(schema['~run']({ value: 0 }, {})).toStrictEqual({
        typed: false,
        value: 0,
        issues: [{ ...baseIssue, input: 0, received: '0' }],
      });
    });

    it('for objects', () => {
      expect(schema['~run']({ value: {} }, {})).toStrictEqual({
        typed: false,
        value: {},
        issues: [{ ...baseIssue, input: {}, received: 'Object' }],
      });
    });

    it('for Temporal.PlainDate', () => {
      const value = Temporal.PlainDate.from('2024-01-01');
      expect(schema['~run']({ value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: 'PlainDate' }],
      });
    });

    it('for Temporal.Instant', () => {
      const value = Temporal.Instant.fromEpochMilliseconds(0);
      expect(schema['~run']({ value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: 'Instant' }],
      });
    });

    it('for Temporal.PlainDateTime', () => {
      const value = Temporal.PlainDateTime.from('2024-01-01T10:00:00');
      expect(schema['~run']({ value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: 'PlainDateTime' }],
      });
    });
  });
});
