import { useMemo } from 'react';

import { useStore } from '@tanstack/react-form';

import { useFormContext } from '#src/tanstack-form.config';

export interface CanSubmitOptions {
  allowSubmitWhenInvalid?: boolean;
}

export function useCanSubmit(options?: Readonly<CanSubmitOptions>) {
  const resolvedCanSubmitOptions = useMemo<Required<CanSubmitOptions>>(() => {
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
