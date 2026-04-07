interface BaseErrorConstructor {
  message: string;
}

class BaseError extends Error {
  constructor(data: BaseErrorConstructor) {
    super(data.message);
    this.name = 'BaseError';
  }

  public static isBaseError(error: unknown): error is BaseError {
    return error instanceof BaseError;
  }
}

export interface FormConversionErrorConstructor extends BaseErrorConstructor {
  readonly data: unknown;
}

export class FormConversionError extends BaseError {
  readonly data: FormConversionErrorConstructor['data'];

  constructor(data: FormConversionErrorConstructor) {
    super(data);
    this.name = 'FormConversionError';
    this.data = data.data;
  }

  public static isFormConversionError(error: unknown): error is FormConversionError {
    return error instanceof FormConversionError;
  }
}
