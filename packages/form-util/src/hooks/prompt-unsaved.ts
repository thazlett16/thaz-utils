import { useStore } from '@tanstack/react-form';
import { useBlocker } from '@tanstack/react-router';

import { useFormContext } from '#src/tanstack-form.config';

export interface PromptUnsavedProps {
  forceShow?: boolean;
  forceHide?: boolean;
}

/**
 * Adjusted from a maintainer but quick reference here: https://discordapp.com/channels/719702312431386674/1491059705165119509/1491066372246081668
 *
 * Not sure if ready yet. need to test logic and make sure it works as expected. Likely need to update this.
 *
 * @param props
 */
export function usePromptUnsaved(props: Readonly<PromptUnsavedProps>) {
  const { forceShow, forceHide } = props;
  const formContext = useFormContext();

  const isDirty = useStore(formContext.store, (state) => state.isDirty);
  const isSubmitting = useStore(formContext.store, (state) => state.isSubmitting);
  const isSubmitted = useStore(formContext.store, (state) => state.isSubmitted);

  let showPrompt = isDirty && !isSubmitting && !isSubmitted;
  if (forceShow) {
    showPrompt = true;
  }
  if (forceHide) {
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
