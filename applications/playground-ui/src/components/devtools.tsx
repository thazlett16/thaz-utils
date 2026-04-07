import { TanStackDevtools } from '@tanstack/react-devtools';
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

export function Devtools() {
  return (
    <TanStackDevtools
      config={{
        panelLocation: 'bottom',
        position: 'bottom-right',
        theme: 'dark',
      }}
      eventBusConfig={{
        debug: true,
        connectToServerBus: true,
      }}
      plugins={[
        {
          name: 'TanStack Query',
          render: () => <ReactQueryDevtoolsPanel />,
        },
        formDevtoolsPlugin(),
        {
          name: 'TanStack Router',
          render: () => <TanStackRouterDevtoolsPanel />,
        },
      ]}
    />
  );
}
