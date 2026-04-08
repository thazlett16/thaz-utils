import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';

import type { TanStackRouterContext } from '#src/configs/tanstack-router';

import { Devtools } from '#src/components/devtools';

export const Route = createRootRouteWithContext<TanStackRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div>/__root</div>
      <Outlet />
      <Devtools />
    </>
  );
}
