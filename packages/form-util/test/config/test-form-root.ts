import { BaseForm } from '#src/components/tanstack-form.config';

import { TestInput } from './input';

export const { useAppForm } = BaseForm.extendForm({
  fieldComponents: {
    TestInput,
  },
});
