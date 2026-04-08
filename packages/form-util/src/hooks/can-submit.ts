import { useStore } from '@tanstack/react-form';
import { useMemo } from 'react';

import { useFormContext } from '#src/tanstack-form.config';

export interface CanSubmitOptions {
    allowSubmitWhenInvalid?: boolean;
}

export type ResolvedCanSubmitOptions = Required<CanSubmitOptions>;

export function useCanSubmit(options?: CanSubmitOptions) {
    const resolvedCanSubmitOptions = useMemo<ResolvedCanSubmitOptions>(() => {
        return {
            allowSubmitWhenInvalid: options?.allowSubmitWhenInvalid ?? false,
        };
    }, [options]);

    const form = useFormContext();

    const isSubmitting = useStore(form.store, (state) => state.isSubmitting);
    const canSubmit = useStore(form.store, (state) => state.canSubmit);

    if (resolvedCanSubmitOptions.allowSubmitWhenInvalid) {
        if (isSubmitting) {
            return false;
        }

        return canSubmit;
    }

    return !isSubmitting;
}
