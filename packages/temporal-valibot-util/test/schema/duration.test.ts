import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vitest';

import type { DurationIssue, DurationSchema } from '../../src/schema/duration';

import { duration } from '../../src/schema/duration';

describe('duration', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<DurationSchema<never>, 'message'> = {
      kind: 'schema',
      type: 'duration',
      reference: duration,
      expects: 'Temporal.Duration',
      async: false,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: DurationSchema<undefined> = { ...baseSchema, message: undefined };
      expect(duration()).toStrictEqual(schema);
      expect(duration(undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(duration('message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies DurationSchema<string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(duration(message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies DurationSchema<typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = duration();

    test('for zero duration', () => {
      const value = new Temporal.Duration();
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for duration with hours', () => {
      const value = Temporal.Duration.from({ hours: 1 });
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for duration with multiple fields', () => {
      const value = Temporal.Duration.from({ years: 1, months: 2, days: 3, hours: 4 });
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for negative duration', () => {
      const value = Temporal.Duration.from({ hours: -5 });
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const schema = duration('message');
    const baseIssue: Omit<DurationIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'duration',
      expected: 'Temporal.Duration',
      message: 'message',
      requirement: undefined,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for null', () => {
      expect(schema['~run']({ value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
        issues: [{ ...baseIssue, input: null, received: 'null' }],
      });
    });

    test('for undefined', () => {
      expect(schema['~run']({ value: undefined }, {})).toStrictEqual({
        typed: false,
        value: undefined,
        issues: [{ ...baseIssue, input: undefined, received: 'undefined' }],
      });
    });

    test('for iso duration strings', () => {
      expect(schema['~run']({ value: 'PT1H' }, {})).toStrictEqual({
        typed: false,
        value: 'PT1H',
        issues: [{ ...baseIssue, input: 'PT1H', received: '"PT1H"' }],
      });
    });

    test('for numbers', () => {
      expect(schema['~run']({ value: 0 }, {})).toStrictEqual({
        typed: false,
        value: 0,
        issues: [{ ...baseIssue, input: 0, received: '0' }],
      });
    });

    test('for booleans', () => {
      expect(schema['~run']({ value: true }, {})).toStrictEqual({
        typed: false,
        value: true,
        issues: [{ ...baseIssue, input: true, received: 'true' }],
      });
    });

    test('for objects', () => {
      expect(schema['~run']({ value: {} }, {})).toStrictEqual({
        typed: false,
        value: {},
        issues: [{ ...baseIssue, input: {}, received: 'Object' }],
      });
    });

    test('for Temporal.Instant', () => {
      const value = Temporal.Instant.fromEpochMilliseconds(0);
      expect(schema['~run']({ value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: 'Instant' }],
      });
    });

    test('for Temporal.PlainDate', () => {
      const value = Temporal.PlainDate.from('2024-01-01');
      expect(schema['~run']({ value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: 'PlainDate' }],
      });
    });
  });
});
