import { RouterProvider } from '@tanstack/react-router';

import { createRouter } from '#src/configs/tanstack-router';

const router = createRouter();

export function EntryApp() {
  return <RouterProvider router={router} />;
}
