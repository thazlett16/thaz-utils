import { describe, expect, it } from 'vitest';

import {
  FormConversionError,
  FormErrorBase,
  FormMessageShapeError,
  FormTypeError,
} from '#src/error';

describe('FormErrorBase', () => {
  it('sets message and name', () => {
    const error = new FormErrorBase({ message: 'base error' });
    expect(error.message).toBe('base error');
    expect(error.name).toBe('FormErrorBase');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(FormErrorBase);
  });

  it('forwards ErrorOptions', () => {
    const cause = new Error('cause');
    const error = new FormErrorBase({ message: 'test' }, { cause });
    expect(error.cause).toBe(cause);
  });

  describe('isFormErrorBase', () => {
    it('returns true for FormErrorBase instance', () => {
      expect(FormErrorBase.isFormErrorBase(new FormErrorBase({ message: 'test' }))).toBe(true);
    });

    it('returns true for subclass instances', () => {
      expect(FormErrorBase.isFormErrorBase(new FormConversionError({ message: 'test' }))).toBe(true);
      expect(FormErrorBase.isFormErrorBase(new FormTypeError({ message: 'test', data: null }))).toBe(true);
      expect(FormErrorBase.isFormErrorBase(new FormMessageShapeError({ message: 'test', data: null }))).toBe(true);
    });

    it('returns false for plain Error', () => {
      expect(FormErrorBase.isFormErrorBase(new Error('test'))).toBe(false);
    });

    it('returns false for non-error values', () => {
      expect(FormErrorBase.isFormErrorBase(null)).toBe(false);
      expect(FormErrorBase.isFormErrorBase(undefined)).toBe(false);
      expect(FormErrorBase.isFormErrorBase('string')).toBe(false);
      expect(FormErrorBase.isFormErrorBase(42)).toBe(false);
    });
  });
});

describe('FormConversionError', () => {
  it('sets message and name', () => {
    const error = new FormConversionError({ message: 'conversion error' });
    expect(error.message).toBe('conversion error');
    expect(error.name).toBe('FormConversionError');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(FormErrorBase);
    expect(error).toBeInstanceOf(FormConversionError);
  });

  describe('isFormConversionError', () => {
    it('returns true for FormConversionError instance', () => {
      expect(FormConversionError.isFormConversionError(new FormConversionError({ message: 'test' }))).toBe(true);
    });

    it('returns false for FormErrorBase', () => {
      expect(FormConversionError.isFormConversionError(new FormErrorBase({ message: 'test' }))).toBe(false);
    });

    it('returns false for other subclasses', () => {
      expect(
        FormConversionError.isFormConversionError(new FormTypeError({ message: 'test', data: null })),
      ).toBe(false);
    });

    it('returns false for non-error values', () => {
      expect(FormConversionError.isFormConversionError(null)).toBe(false);
      expect(FormConversionError.isFormConversionError('string')).toBe(false);
    });
  });
});

describe('FormTypeError', () => {
  it('sets message, name, and data', () => {
    const data = { field: 'value' };
    const error = new FormTypeError({ message: 'type error', data });
    expect(error.message).toBe('type error');
    expect(error.name).toBe('FormTypeError');
    expect(error.data).toBe(data);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(FormErrorBase);
    expect(error).toBeInstanceOf(FormTypeError);
  });

  it('stores arbitrary data values', () => {
    expect(new FormTypeError({ message: 'test', data: null }).data).toBeNull();
    expect(new FormTypeError({ message: 'test', data: 42 }).data).toBe(42);
    expect(new FormTypeError({ message: 'test', data: 'str' }).data).toBe('str');
  });

  describe('isFormTypeError', () => {
    it('returns true for FormTypeError instance', () => {
      expect(FormTypeError.isFormTypeError(new FormTypeError({ message: 'test', data: null }))).toBe(true);
    });

    it('returns false for FormErrorBase', () => {
      expect(FormTypeError.isFormTypeError(new FormErrorBase({ message: 'test' }))).toBe(false);
    });

    it('returns false for non-error values', () => {
      expect(FormTypeError.isFormTypeError(null)).toBe(false);
    });
  });
});

describe('FormMessageShapeError', () => {
  it('sets message, name, and data', () => {
    const data = [1, 2, 3];
    const error = new FormMessageShapeError({ message: 'shape error', data });
    expect(error.message).toBe('shape error');
    expect(error.name).toBe('FormMessageShapeError');
    expect(error.data).toBe(data);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(FormErrorBase);
    expect(error).toBeInstanceOf(FormMessageShapeError);
  });

  it('stores arbitrary data values', () => {
    expect(new FormMessageShapeError({ message: 'test', data: null }).data).toBeNull();
    expect(new FormMessageShapeError({ message: 'test', data: {} }).data).toStrictEqual({});
  });

  describe('isFormMessageShapeError', () => {
    it('returns true for FormMessageShapeError instance', () => {
      expect(
        FormMessageShapeError.isFormMessageShapeError(new FormMessageShapeError({ message: 'test', data: null })),
      ).toBe(true);
    });

    it('returns false for FormErrorBase', () => {
      expect(FormMessageShapeError.isFormMessageShapeError(new FormErrorBase({ message: 'test' }))).toBe(false);
    });

    it('returns false for non-error values', () => {
      expect(FormMessageShapeError.isFormMessageShapeError(null)).toBe(false);
    });
  });
});
