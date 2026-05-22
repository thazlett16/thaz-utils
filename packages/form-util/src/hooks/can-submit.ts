import { useMemo } from 'react';

import { useStore } from '@tanstack/react-form';

import { useFormContext } from '#src/tanstack-form.config';

/** Options for {@link useCanSubmit}. */
export interface CanSubmitOptions {
  /**
   * When `false` (default), the hook only blocks submission while the form is actively submitting,
   * ignoring validity. When `true`, the hook additionally respects TanStack Form's `canSubmit`
   * state, which blocks submission when the form is invalid.
   */
  allowSubmitWhenInvalid: boolean;
}

/**
 * Returns `true` when the current form is in a state where a submit action should be allowed.
 *
 * By default (`allowSubmitWhenInvalid: false`) submission is only blocked while the form is
 * already submitting. Pass `{ allowSubmitWhenInvalid: true }` to also block submission when
 * TanStack Form's `canSubmit` is `false` (e.g. the form is invalid).
 *
 * Must be called within a component rendered inside a `BaseForm` form hook.
 *
 * @param options - {@link CanSubmitOptions}
 * @returns `true` when submission is permitted.
 */
export function useCanSubmit(options?: Partial<Readonly<CanSubmitOptions>>) {
  const resolvedCanSubmitOptions: CanSubmitOptions = {
    allowSubmitWhenInvalid: options?.allowSubmitWhenInvalid ?? false,
  };
  const form = useFormContext();
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);
  const canSubmit = useStore(form.store, (state) => state.canSubmit);

  return useMemo(() => {
    if (resolvedCanSubmitOptions.allowSubmitWhenInvalid) {
      if (isSubmitting) {
        return false;
      }
      return canSubmit;
    }

    return !isSubmitting;
  }, [resolvedCanSubmitOptions.allowSubmitWhenInvalid, isSubmitting, canSubmit]);
}
