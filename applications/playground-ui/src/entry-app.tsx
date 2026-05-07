import { RouterProvider } from '@tanstack/react-router';

import { getRouter } from '#src/configs/tanstack-router';

const router = getRouter();

export function EntryApp() {
  return <RouterProvider router={router} />;
}
