/// <reference types="@total-typescript/ts-reset" />
/// <reference types="@total-typescript/ts-reset/dom" />

import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import { EntryApp } from '#src/entry-app';

const rootElement = document.querySelector('#root');

if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <EntryApp />
    </StrictMode>,
  );
} else {
  throw new Error('Root element is missing');
}
