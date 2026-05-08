import { describe, expectTypeOf, test } from 'vite-plus/test';

import { FormConversionError, FormErrorBase, FormMessageShapeError, FormTypeError } from '#src/error';

describe('formErrorBase', () => {
  test('isFormErrorBase is a type guard', () => {
    const error: unknown = new FormErrorBase({ message: 'test' });
    if (FormErrorBase.isFormErrorBase(error)) {
      expectTypeOf(error).toEqualTypeOf<FormErrorBase>();
    }
  });
});

describe('formConversionError', () => {
  test('isFormConversionError is a type guard', () => {
    const error: unknown = new FormConversionError({ message: 'test' });
    if (FormConversionError.isFormConversionError(error)) {
      expectTypeOf(error).toEqualTypeOf<FormConversionError>();
    }
  });
});

describe('formTypeError', () => {
  test('data is typed as unknown', () => {
    const error = new FormTypeError({ message: 'test', data: 42 });
    expectTypeOf(error.data).toEqualTypeOf<unknown>();
  });

  test('isFormTypeError is a type guard', () => {
    const error: unknown = new FormTypeError({ message: 'test', data: null });
    if (FormTypeError.isFormTypeError(error)) {
      expectTypeOf(error).toEqualTypeOf<FormTypeError>();
    }
  });
});

describe('formMessageShapeError', () => {
  test('data is typed as unknown', () => {
    const error = new FormMessageShapeError({ message: 'test', data: {} });
    expectTypeOf(error.data).toEqualTypeOf<unknown>();
  });

  test('isFormMessageShapeError is a type guard', () => {
    const error: unknown = new FormMessageShapeError({ message: 'test', data: null });
    if (FormMessageShapeError.isFormMessageShapeError(error)) {
      expectTypeOf(error).toEqualTypeOf<FormMessageShapeError>();
    }
  });
});
