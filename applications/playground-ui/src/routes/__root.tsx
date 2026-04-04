import { Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div>Hello &ldquo__root&rquo!</div>
      <Outlet />
    </>
  );
}
