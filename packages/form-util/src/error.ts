/** Constructor arguments for {@link FormErrorBase}. */
export interface FormErrorBaseConstructor {
  message: string;
}

/** Base class for all form-related errors in this library. */
export class FormErrorBase extends Error {
  constructor(props: Readonly<FormErrorBaseConstructor>, options?: ErrorOptions) {
    super(props.message, options);
    this.name = 'FormErrorBase';
  }

  /** Returns `true` when `error` is a `FormErrorBase` instance (or any subclass). */
  public static isFormErrorBase(error: unknown): error is FormErrorBase {
    return error instanceof FormErrorBase;
  }
}

/** Constructor arguments for {@link FormConversionError}. */
export type FormConversionErrorConstructor = FormErrorBaseConstructor;

/** Thrown when a value cannot be converted from one form type to another. */
export class FormConversionError extends FormErrorBase {
  constructor(props: Readonly<FormConversionErrorConstructor>, options?: ErrorOptions) {
    super(props, options);
    this.name = 'FormConversionError';
  }

  /** Returns `true` when `error` is a `FormConversionError` instance. */
  public static isFormConversionError(error: unknown): error is FormConversionError {
    return error instanceof FormConversionError;
  }
}

/** Constructor arguments for {@link FormTypeError}. */
export interface FormTypeErrorConstructor extends FormErrorBaseConstructor {
  /** The value that triggered the type error. */
  data: unknown;
}

/** Thrown when a form field value does not match the expected type. */
export class FormTypeError extends FormErrorBase {
  /** The value that triggered the type error. */
  readonly data: FormTypeErrorConstructor['data'];

  constructor(props: Readonly<FormTypeErrorConstructor>, options?: ErrorOptions) {
    super(props, options);
    this.name = 'FormTypeError';
    this.data = props.data;
  }

  /** Returns `true` when `error` is a `FormTypeError` instance. */
  public static isFormTypeError(error: unknown): error is FormTypeError {
    return error instanceof FormTypeError;
  }
}

/** Constructor arguments for {@link FormMessageShapeError}. */
export interface FormMessageShapeErrorConstructor extends FormErrorBaseConstructor {
  /** The value that had an unexpected shape. */
  data: unknown;
}

/** Thrown when a form message does not match the expected shape. */
export class FormMessageShapeError extends FormErrorBase {
  /** The value that had an unexpected shape. */
  readonly data: FormMessageShapeErrorConstructor['data'];

  constructor(props: Readonly<FormMessageShapeErrorConstructor>, options?: ErrorOptions) {
    super(props, options);
    this.name = 'FormMessageShapeError';
    this.data = props.data;
  }

  /** Returns `true` when `error` is a `FormMessageShapeError` instance. */
  public static isFormMessageShapeError(error: unknown): error is FormMessageShapeError {
    return error instanceof FormMessageShapeError;
  }
}
