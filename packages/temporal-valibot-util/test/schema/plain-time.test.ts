import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vitest';

import type { PlainTimeIssue, PlainTimeSchema } from '#src/schema/plain-time';

import { plainTime } from '#src/schema/plain-time';

describe('plainTime', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<PlainTimeSchema<never>, 'message'> = {
      kind: 'schema',
      type: 'plain_time',
      reference: plainTime,
      expects: 'Temporal.PlainTime',
      async: false,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    it('with undefined message', () => {
      const schema: PlainTimeSchema<undefined> = { ...baseSchema, message: undefined };
      expect(plainTime()).toStrictEqual(schema);
      expect(plainTime(undefined)).toStrictEqual(schema);
    });

    it('with string message', () => {
      expect(plainTime('message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies PlainTimeSchema<string>);
    });

    it('with function message', () => {
      const message = () => 'message';
      expect(plainTime(message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies PlainTimeSchema<typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = plainTime();

    it('for midnight', () => {
      const value = Temporal.PlainTime.from('00:00:00');
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });

    it('for noon', () => {
      const value = Temporal.PlainTime.from('12:00:00');
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });

    it('for end of day', () => {
      const value = Temporal.PlainTime.from('23:59:59.999');
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const schema = plainTime('message');
    const baseIssue: Omit<PlainTimeIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'plain_time',
      expected: 'Temporal.PlainTime',
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

    it('for iso time strings', () => {
      expect(schema['~run']({ value: '10:00:00' }, {})).toStrictEqual({
        typed: false,
        value: '10:00:00',
        issues: [{ ...baseIssue, input: '10:00:00', received: '"10:00:00"' }],
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
  });
});
