import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';

import type { TanStackRouterContext } from '#src/configs/tanstack-router';

import * as m from '#src/paraglide/messages';

export const Route = createRootRouteWithContext<TanStackRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div>
        {m.example_message({
          userName: 'asdf',
        })}
        !
      </div>
      <Outlet />
    </>
  );
}
