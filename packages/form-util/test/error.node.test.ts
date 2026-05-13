import { describe, expect, test } from 'vite-plus/test';

import { FormConversionError, FormErrorBase, FormMessageShapeError, FormTypeError } from '#src/error';

describe('FormErrorBase', () => {
  test('constructs with message and sets name', () => {
    const err = new FormErrorBase({ message: 'base error' });
    expect(err.message).toBe('base error');
    expect(err.name).toBe('FormErrorBase');
    expect(err instanceof Error).toBe(true);
  });

  test('isFormErrorBase returns true for FormErrorBase instance', () => {
    const err = new FormErrorBase({ message: '' });
    expect(FormErrorBase.isFormErrorBase(err)).toBe(true);
  });

  test('isFormErrorBase returns true for subclass instances', () => {
    expect(FormErrorBase.isFormErrorBase(new FormConversionError({ message: '' }))).toBe(true);
    expect(FormErrorBase.isFormErrorBase(new FormTypeError({ message: '', data: null }))).toBe(true);
    expect(FormErrorBase.isFormErrorBase(new FormMessageShapeError({ message: '', data: null }))).toBe(true);
  });

  test('isFormErrorBase returns false for plain Error', () => {
    expect(FormErrorBase.isFormErrorBase(new Error())).toBe(false);
  });

  test('isFormErrorBase returns false for non-error values', () => {
    expect(FormErrorBase.isFormErrorBase(null)).toBe(false);
    expect(FormErrorBase.isFormErrorBase('string')).toBe(false);
    expect(FormErrorBase.isFormErrorBase(42)).toBe(false);
  });
});

describe('FormConversionError', () => {
  test('constructs with message and sets name', () => {
    const err = new FormConversionError({ message: 'conversion error' });
    expect(err.message).toBe('conversion error');
    expect(err.name).toBe('FormConversionError');
    expect(err instanceof FormErrorBase).toBe(true);
  });

  test('isFormConversionError returns true for FormConversionError instance', () => {
    const err = new FormConversionError({ message: '' });
    expect(FormConversionError.isFormConversionError(err)).toBe(true);
  });

  test('isFormConversionError returns false for base class', () => {
    expect(FormConversionError.isFormConversionError(new FormErrorBase({ message: '' }))).toBe(false);
  });

  test('isFormConversionError returns false for non-FormConversionError values', () => {
    expect(FormConversionError.isFormConversionError(new Error())).toBe(false);
    expect(FormConversionError.isFormConversionError(null)).toBe(false);
  });
});

describe('FormTypeError', () => {
  test('constructs with message and data, sets name', () => {
    const err = new FormTypeError({ message: 'type error', data: 42 });
    expect(err.message).toBe('type error');
    expect(err.name).toBe('FormTypeError');
    expect(err.data).toBe(42);
    expect(err instanceof FormErrorBase).toBe(true);
  });

  test('stores data of any type', () => {
    const data = { nested: { value: 'test' } };
    const err = new FormTypeError({ message: '', data });
    expect(err.data).toBe(data);
  });

  test('isFormTypeError returns true for FormTypeError instance', () => {
    const err = new FormTypeError({ message: '', data: null });
    expect(FormTypeError.isFormTypeError(err)).toBe(true);
  });

  test('isFormTypeError returns false for non-FormTypeError values', () => {
    expect(FormTypeError.isFormTypeError(new FormErrorBase({ message: '' }))).toBe(false);
    expect(FormTypeError.isFormTypeError(new Error())).toBe(false);
    expect(FormTypeError.isFormTypeError(null)).toBe(false);
  });
});

describe('FormMessageShapeError', () => {
  test('constructs with message and data, sets name', () => {
    const err = new FormMessageShapeError({ message: 'shape error', data: { code: 'ERR' } });
    expect(err.message).toBe('shape error');
    expect(err.name).toBe('FormMessageShapeError');
    expect(err.data).toEqual({ code: 'ERR' });
    expect(err instanceof FormErrorBase).toBe(true);
  });

  test('stores data of any type', () => {
    const data = [1, 2, 3];
    const err = new FormMessageShapeError({ message: '', data });
    expect(err.data).toBe(data);
  });

  test('isFormMessageShapeError returns true for FormMessageShapeError instance', () => {
    const err = new FormMessageShapeError({ message: '', data: null });
    expect(FormMessageShapeError.isFormMessageShapeError(err)).toBe(true);
  });

  test('isFormMessageShapeError returns false for non-FormMessageShapeError values', () => {
    expect(FormMessageShapeError.isFormMessageShapeError(new FormErrorBase({ message: '' }))).toBe(false);
    expect(FormMessageShapeError.isFormMessageShapeError(new Error())).toBe(false);
    expect(FormMessageShapeError.isFormMessageShapeError(null)).toBe(false);
  });
});
