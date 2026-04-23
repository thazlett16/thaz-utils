import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vitest';

import type { InstantIssue, InstantSchema } from '../../src/schema/instant';

import { instant } from '../../src/schema/instant';

describe('instant', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<InstantSchema<never>, 'message'> = {
      kind: 'schema',
      type: 'instant',
      reference: instant,
      expects: 'Temporal.Instant',
      async: false,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: InstantSchema<undefined> = { ...baseSchema, message: undefined };
      expect(instant()).toStrictEqual(schema);
      expect(instant(undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(instant('message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies InstantSchema<string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(instant(message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies InstantSchema<typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = instant();

    test('for epoch instant', () => {
      const value = Temporal.Instant.fromEpochMilliseconds(0);
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for positive epoch instant', () => {
      const value = Temporal.Instant.fromEpochMilliseconds(1_700_000_000_000);
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for instant from ISO string', () => {
      const value = Temporal.Instant.from('2024-06-15T12:00:00Z');
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const schema = instant('message');
    const baseIssue: Omit<InstantIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'instant',
      expected: 'Temporal.Instant',
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

    test('for iso instant strings', () => {
      expect(schema['~run']({ value: '2024-01-01T00:00:00Z' }, {})).toStrictEqual({
        typed: false,
        value: '2024-01-01T00:00:00Z',
        issues: [{ ...baseIssue, input: '2024-01-01T00:00:00Z', received: '"2024-01-01T00:00:00Z"' }],
      });
    });

    test('for numbers', () => {
      expect(schema['~run']({ value: 1_000_000 }, {})).toStrictEqual({
        typed: false,
        value: 1_000_000,
        issues: [{ ...baseIssue, input: 1_000_000, received: '1000000' }],
      });
    });

    test('for objects', () => {
      expect(schema['~run']({ value: {} }, {})).toStrictEqual({
        typed: false,
        value: {},
        issues: [{ ...baseIssue, input: {}, received: 'Object' }],
      });
    });

    test('for Temporal.Duration', () => {
      const value = Temporal.Duration.from({ hours: 1 });
      expect(schema['~run']({ value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: 'Duration' }],
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

    test('for Temporal.ZonedDateTime', () => {
      const value = Temporal.ZonedDateTime.from('2024-01-01T00:00:00+00:00[UTC]');
      expect(schema['~run']({ value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: 'ZonedDateTime' }],
      });
    });
  });
});
