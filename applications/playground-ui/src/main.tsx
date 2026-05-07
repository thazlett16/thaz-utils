/// <reference types="@total-typescript/ts-reset" />
/// <reference types="@total-typescript/ts-reset/dom" />

import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import { EntryApp } from '#src/entry-app';

const rootElement = document.querySelector('#root');

if (rootElement === null) {
  throw new Error('Root element is missing');
}

async function enableMocking() {
  if (import.meta.env.PROD) {
    return;
  }

  const { worker } = await import('#mock/browser');

  await worker.start();
}

await enableMocking();

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <EntryApp />
  </StrictMode>,
);
