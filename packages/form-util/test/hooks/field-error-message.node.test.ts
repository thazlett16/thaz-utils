import { describe, expect, test } from 'vite-plus/test';

import { FormMessageShapeError } from '#src/error';
import { formatErrorList, isStandardSchemaMessageShape } from '#src/hooks/field-error-message';

describe('isStandardSchemaMessageShape', () => {
  test('returns true for an object with a string message', () => {
    expect(isStandardSchemaMessageShape({ message: 'some error' })).toBeTruthy();
  });

  test('returns false for an object with a non-string message', () => {
    expect(isStandardSchemaMessageShape({ message: 42 })).toBeFalsy();
  });

  test('returns false for null', () => {
    expect(isStandardSchemaMessageShape(null)).toBeFalsy();
  });

  test('returns false for undefined', () => {
    expect(isStandardSchemaMessageShape(undefined)).toBeFalsy();
  });

  test('returns false for a plain string', () => {
    expect(isStandardSchemaMessageShape('some error')).toBeFalsy();
  });

  test('returns false for a number', () => {
    expect(isStandardSchemaMessageShape(42)).toBeFalsy();
  });

  test('returns false for an object missing the message property', () => {
    expect(isStandardSchemaMessageShape({ other: 'value' })).toBeFalsy();
  });
});

describe('formatErrorList', () => {
  test('returns null for an empty array', () => {
    expect(formatErrorList([])).toBeNull();
  });

  test('returns the string when the first error is a string', () => {
    expect(formatErrorList(['validation failed'])).toBe('validation failed');
  });

  test('returns the message when the first error matches the standard schema shape', () => {
    expect(formatErrorList([{ message: 'field is required' }])).toBe('field is required');
  });

  test('throws FormMessageShapeError for an error with an unknown shape', () => {
    expect(() => formatErrorList([{ code: 'UNKNOWN', detail: 'bad' }])).toThrow(FormMessageShapeError);
  });

  test('only uses the first error and ignores the rest', () => {
    expect(formatErrorList(['first error', 'second error', { message: 'third' }])).toBe('first error');
  });
});
