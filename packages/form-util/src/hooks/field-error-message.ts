import { useStore } from '@tanstack/react-form';
import { useMemo } from 'react';

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
    for (const error of errors) {
        if (isStandardSchemaMessageShape(error)) {
            return error.message;
        } else if (typeof error === 'string') {
            return error;
        }
        console.error('Form has illegal validation error shape:', error);
        throw new Error('Form has illegal validation error shape');
    }

    return null;
}

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

// function formatErrorList(errors: unknown[]): string[] {
//     const errorMessageList: string[] = [];
//     for (const error of errors) {
//         if (isStandardSchemaMessageShape(error)) {
//             errorMessageList.push(error.message);
//         } else if (typeof error === 'string') {
//             errorMessageList.push(error);
//         } else {
//             console.error('Form has illegal validation error shape:', error);
//             throw new Error('Form has illegal validation error shape');
//         }
//     }
//
//     return errorMessageList;
// }
//
// export function useFieldErrorMessageList() {
//     const field = useFieldContext();
//
//     const isBlurred = useStore(field.store, (state) => state.meta.isBlurred);
//
//     const submissionAttempts = useStore(field.form.store, (state) => state.submissionAttempts);
//     const isSubmitted = submissionAttempts > 0;
//
//     // We are immediately formatting the value so it is safe here
//     // oxlint-disable-next-line typescript/no-unsafe-return
//     const errorList = useStore(field.store, (state) => state.meta.errors);
//     const formattedErrorList = useMemo(() => {
//         return formatErrorList(errorList);
//     }, [errorList]);
//
//     return (isSubmitted || isBlurred) && formattedErrorList[0] ? formattedErrorList[0] : null;
// }
