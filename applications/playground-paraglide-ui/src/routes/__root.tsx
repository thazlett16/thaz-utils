import { Outlet, createRootRoute } from '@tanstack/react-router';

import { Devtools } from '#src/components/devtools';
import * as m from '#src/paraglide/messages';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div>/__root</div>
      <Outlet />
      <Devtools />
      <div>
        {m.example_message({
          userName: 'asdf',
        })}
      </div>
      <div>
        {m.module_1example_message({
          userName: 'asdf',
        })}
      </div>
    </>
  );
}
