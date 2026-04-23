import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vitest';

import type { PlainDateIssue, PlainDateSchema } from '#src/schema/plain-date';

import { plainDate } from '#src/schema/plain-date';

describe('plainDate', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<PlainDateSchema<never>, 'message'> = {
      kind: 'schema',
      type: 'plain_date',
      reference: plainDate,
      expects: 'Temporal.PlainDate',
      async: false,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    it('with undefined message', () => {
      const schema: PlainDateSchema<undefined> = { ...baseSchema, message: undefined };
      expect(plainDate()).toStrictEqual(schema);
      expect(plainDate(undefined)).toStrictEqual(schema);
    });

    it('with string message', () => {
      expect(plainDate('message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies PlainDateSchema<string>);
    });

    it('with function message', () => {
      const message = () => 'message';
      expect(plainDate(message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies PlainDateSchema<typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = plainDate();

    it('for a plain date', () => {
      const value = Temporal.PlainDate.from('2024-01-01');
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });

    it('for a mid-year date', () => {
      const value = Temporal.PlainDate.from('2024-06-15');
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });

    it('for a year-end date', () => {
      const value = Temporal.PlainDate.from('2024-12-31');
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const schema = plainDate('message');
    const baseIssue: Omit<PlainDateIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'plain_date',
      expected: 'Temporal.PlainDate',
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

    it('for iso date strings', () => {
      expect(schema['~run']({ value: '2024-01-01' }, {})).toStrictEqual({
        typed: false,
        value: '2024-01-01',
        issues: [{ ...baseIssue, input: '2024-01-01', received: '"2024-01-01"' }],
      });
    });

    it('for numbers', () => {
      expect(schema['~run']({ value: 20_240_101 }, {})).toStrictEqual({
        typed: false,
        value: 20_240_101,
        issues: [{ ...baseIssue, input: 20_240_101, received: '20240101' }],
      });
    });

    it('for objects', () => {
      expect(schema['~run']({ value: {} }, {})).toStrictEqual({
        typed: false,
        value: {},
        issues: [{ ...baseIssue, input: {}, received: 'Object' }],
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

    it('for Temporal.ZonedDateTime', () => {
      const value = Temporal.ZonedDateTime.from('2024-01-01T00:00:00+00:00[UTC]');
      expect(schema['~run']({ value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: 'ZonedDateTime' }],
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
  });
});
