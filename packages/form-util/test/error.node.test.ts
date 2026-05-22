import { describe, expect, test } from 'vite-plus/test';

import { FormConversionError, FormMessageShapeError, FormTypeError } from '#src/form-error';

describe('formConversionError', () => {
  test('constructs with message and sets name', () => {
    const err = new FormConversionError({ message: 'conversion error' });
    expect(err.message).toBe('conversion error');
    expect(err.name).toBe('FormConversionError');
    expect(err instanceof FormConversionError).toBeTruthy();
  });

  test('isFormConversionError returns true for FormConversionError instance', () => {
    const err = new FormConversionError({ message: '' });
    expect(FormConversionError.isFormConversionError(err)).toBeTruthy();
  });

  test('isFormConversionError returns false for non-FormConversionError values', () => {
    expect(FormConversionError.isFormConversionError(new Error('Dummy error message'))).toBeFalsy();
    expect(FormConversionError.isFormConversionError(null)).toBeFalsy();
  });
});

describe('formTypeError', () => {
  test('constructs with message and data, sets name', () => {
    const err = new FormTypeError({ message: 'type error', data: 42 });
    expect(err.message).toBe('type error');
    expect(err.name).toBe('FormTypeError');
    expect(err.data).toBe(42);
    expect(err instanceof FormTypeError).toBeTruthy();
  });

  test('stores data of any type', () => {
    const data = { nested: { value: 'test' } };
    const err = new FormTypeError({ message: '', data });
    expect(err.data).toBe(data);
  });

  test('isFormTypeError returns true for FormTypeError instance', () => {
    const err = new FormTypeError({ message: '', data: null });
    expect(FormTypeError.isFormTypeError(err)).toBeTruthy();
  });

  test('isFormTypeError returns false for non-FormTypeError values', () => {
    expect(FormTypeError.isFormTypeError(new Error('Dummy error message'))).toBeFalsy();
    expect(FormTypeError.isFormTypeError(null)).toBeFalsy();
  });
});

describe('formMessageShapeError', () => {
  test('constructs with message and data, sets name', () => {
    const err = new FormMessageShapeError({ message: 'shape error', data: { code: 'ERR' } });
    expect(err.message).toBe('shape error');
    expect(err.name).toBe('FormMessageShapeError');
    expect(err.data).toStrictEqual({ code: 'ERR' });
    expect(err instanceof FormMessageShapeError).toBeTruthy();
  });

  test('stores data of any type', () => {
    const data = [1, 2, 3];
    const err = new FormMessageShapeError({ message: '', data });
    expect(err.data).toBe(data);
  });

  test('isFormMessageShapeError returns true for FormMessageShapeError instance', () => {
    const err = new FormMessageShapeError({ message: '', data: null });
    expect(FormMessageShapeError.isFormMessageShapeError(err)).toBeTruthy();
  });

  test('isFormMessageShapeError returns false for non-FormMessageShapeError values', () => {
    expect(FormMessageShapeError.isFormMessageShapeError(new Error('Dummy error message'))).toBeFalsy();
    expect(FormMessageShapeError.isFormMessageShapeError(null)).toBeFalsy();
  });
});
