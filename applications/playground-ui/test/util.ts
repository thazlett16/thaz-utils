import { test as baseTest } from 'vite-plus/test';
import { page, userEvent } from 'vite-plus/test/browser';

import { worker } from '#mock/browser';

import { renderWithProviders } from './render-with';

export const test = baseTest
  .extend('worker', { auto: true }, async (_testScopeContext, { onCleanup }) => {
    await worker.start();

    onCleanup(() => {
      worker.resetHandlers();
    });

    return worker;
  })
  .extend('page', () => {
    return page;
  })
  .extend('userEvent', () => {
    return userEvent;
  })
  .extend('renderWithProviders', () => {
    return renderWithProviders;
  });
