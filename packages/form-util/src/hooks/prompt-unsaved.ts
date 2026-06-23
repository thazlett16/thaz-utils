import { useStore } from '@tanstack/react-form';
import { useBlocker } from '@tanstack/react-router';

import { useFormContext } from '#src/tanstack-form.config';

export interface PromptUnsavedOptions {
  forceShow: boolean;
  forceHide: boolean;
}

/**
 * Blocks TanStack Router navigation (and `beforeunload`) when the form has unsaved changes.
 *
 * Maintainer implementation found here: https://discordapp.com/channels/719702312431386674/1491059705165119509/1491066372246081668
 *
 * The prompt is shown when the form is dirty and has not been submitted or is not currently
 * submitting. Use `forceShow` / `forceHide` to override this logic.
 *
 * Must be called within a component rendered inside a form hook.
 *
 * @param options - {@link PromptUnsavedOptions}
 * @returns The blocker object from `useBlocker`, which includes `proceed` and `reset` callbacks.
 */
export function usePromptUnsaved(options?: Partial<Readonly<PromptUnsavedOptions>>) {
  const formContext = useFormContext();

  //  Disabled till @tanstack/react-form exports useSelector instead
  // oxlint-disable-next-line typescript/no-deprecated
  const isDirty = useStore(formContext.store, (state) => state.isDirty);
  //  Disabled till @tanstack/react-form exports useSelector instead
  // oxlint-disable-next-line typescript/no-deprecated
  const isSubmitting = useStore(formContext.store, (state) => state.isSubmitting);
  //  Disabled till @tanstack/react-form exports useSelector instead
  // oxlint-disable-next-line typescript/no-deprecated
  const isSubmitted = useStore(formContext.store, (state) => state.isSubmitted);

  let showPrompt = isDirty && !isSubmitting && !isSubmitted;
  if (options?.forceShow) {
    showPrompt = true;
  }
  if (options?.forceHide) {
    showPrompt = false;
  }

  return useBlocker({
    shouldBlockFn: () => {
      return showPrompt;
    },
    enableBeforeUnload: showPrompt,
    withResolver: true,
  });
}
