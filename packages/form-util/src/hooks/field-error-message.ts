import { useMemo } from 'react';

import { useStore } from '@tanstack/react-form';

import { FormMessageShapeError } from '#src/error';
import { useFieldContext } from '#src/tanstack-form.config';

function isStandardSchemaMessageShape(error: unknown): error is { message: string } {
  return (
    error !== null &&
    error !== undefined &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  );
}

function formatErrorList(errors: unknown[]) {
  if (errors.length === 0) {
    return null;
  }

  const [error] = errors;

  if (isStandardSchemaMessageShape(error)) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  }

  throw new FormMessageShapeError({
    data: error,
    message: 'Form has illegal validation error shape. Please handle this shape separately in a new hook.',
  });
}

/**
 * Returns the first formatted validation error message for the current field, or `null` when
 * there are no errors or the field has not yet been blurred and no submission has been attempted.
 *
 * Accepts errors shaped as `{ message: string }` (Standard Schema) or plain `string`. Throws
 * {@link FormMessageShapeError} for any other error shape.
 *
 * Must be called within a field component.
 *
 * @returns The error message `string`, or `null`.
 */
export function useFieldErrorMessageList() {
  const field = useFieldContext();

  const isBlurred = useStore(field.store, (state) => state.meta.isBlurred);

  const submissionAttempts = useStore(field.form.store, (state) => state.submissionAttempts);

  // We are immediately formatting the value so it is safe here
  // oxlint-disable-next-line typescript/no-unsafe-return
  const errorList = useStore(field.store, (state) => state.meta.errors);
  const formattedError = useMemo(() => {
    return formatErrorList(errorList);
  }, [errorList]);

  if (submissionAttempts > 0 || isBlurred) {
    return formattedError;
  }

  return null;
}
