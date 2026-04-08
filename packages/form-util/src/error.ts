export interface FormErrorBaseConstructor {
  message: string;
}

export class FormErrorBase extends Error {
  constructor(props: Readonly<FormErrorBaseConstructor>, options?: ErrorOptions) {
    super(props.message, options);
    this.name = 'FormErrorBase';
  }

  public static isFormErrorBase(error: unknown): error is FormErrorBase {
    return error instanceof FormErrorBase;
  }
}

export type FormConversionErrorConstructor = FormErrorBaseConstructor;

export class FormConversionError extends FormErrorBase {
  constructor(props: Readonly<FormConversionErrorConstructor>, options?: ErrorOptions) {
    super(props, options);
    this.name = 'FormConversionError';
  }

  public static isFormConversionError(error: unknown): error is FormConversionError {
    return error instanceof FormConversionError;
  }
}

export interface FormTypeErrorConstructor extends FormErrorBaseConstructor {
  data: unknown;
}

export class FormTypeError extends FormErrorBase {
  readonly data: FormTypeErrorConstructor['data'];

  constructor(props: Readonly<FormTypeErrorConstructor>, options?: ErrorOptions) {
    super(props, options);
    this.name = 'FormTypeError';
    this.data = props.data;
  }

  public static isFormTypeError(error: unknown): error is FormTypeError {
    return error instanceof FormTypeError;
  }
}

export interface FormMessageShapeErrorConstructor extends FormErrorBaseConstructor {
  data: unknown;
}

export class FormMessageShapeError extends FormErrorBase {
  readonly data: FormMessageShapeErrorConstructor['data'];

  constructor(props: Readonly<FormMessageShapeErrorConstructor>, options?: ErrorOptions) {
    super(props, options);
    this.name = 'FormMessageShapeError';
    this.data = props.data;
  }

  public static isFormMessageShapeError(error: unknown): error is FormMessageShapeError {
    return error instanceof FormMessageShapeError;
  }
}
