import { describe, expect, it } from 'vitest';

import { FormMessageShapeError } from '#src/error';
import { formatErrorList, isStandardSchemaMessageShape } from '#src/hooks/field-error-message';

describe('isStandardSchemaMessageShape', () => {
  it('returns true for an object with a string message', () => {
    expect(isStandardSchemaMessageShape({ message: 'some error' })).toBe(true);
  });

  it('returns false for an object with a non-string message', () => {
    expect(isStandardSchemaMessageShape({ message: 42 })).toBe(false);
  });

  it('returns false for null', () => {
    expect(isStandardSchemaMessageShape(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isStandardSchemaMessageShape(undefined)).toBe(false);
  });

  it('returns false for a plain string', () => {
    expect(isStandardSchemaMessageShape('some error')).toBe(false);
  });

  it('returns false for a number', () => {
    expect(isStandardSchemaMessageShape(42)).toBe(false);
  });

  it('returns false for an object missing the message property', () => {
    expect(isStandardSchemaMessageShape({ other: 'value' })).toBe(false);
  });
});

describe('formatErrorList', () => {
  it('returns null for an empty array', () => {
    expect(formatErrorList([])).toBeNull();
  });

  it('returns the string when the first error is a string', () => {
    expect(formatErrorList(['validation failed'])).toBe('validation failed');
  });

  it('returns the message when the first error matches the standard schema shape', () => {
    expect(formatErrorList([{ message: 'field is required' }])).toBe('field is required');
  });

  it('throws FormMessageShapeError for an error with an unknown shape', () => {
    expect(() => formatErrorList([{ code: 'UNKNOWN', detail: 'bad' }])).toThrow(FormMessageShapeError);
  });

  it('only uses the first error and ignores the rest', () => {
    expect(formatErrorList(['first error', 'second error', { message: 'third' }])).toBe('first error');
  });
});
