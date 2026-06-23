import { TanStackDevtools } from '@tanstack/react-devtools';
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

const renderQueryPanel = () => <ReactQueryDevtoolsPanel />;
const renderRouterPanel = () => <TanStackRouterDevtoolsPanel />;

export function Devtools() {
  return (
    <TanStackDevtools
      config={{
        panelLocation: 'bottom',
        position: 'bottom-right',
        theme: 'dark',
      }}
      // eventBusConfig={{
      //   debug: true,
      //   connectToServerBus: true,
      // }}
      plugins={[
        {
          name: 'TanStack Query',
          render: renderQueryPanel,
        },
        formDevtoolsPlugin(),
        {
          name: 'TanStack Router',
          render: renderRouterPanel,
        },
      ]}
    />
  );
}
