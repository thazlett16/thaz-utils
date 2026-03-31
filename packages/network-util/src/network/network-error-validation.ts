import { StandardSchemaError } from '@ts-rest/core';

export function isNetworkValidationError(error: unknown): error is StandardSchemaError {
  return error instanceof StandardSchemaError;
}
