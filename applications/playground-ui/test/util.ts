import { test as baseTest } from 'vite-plus/test';
import { page, userEvent } from 'vite-plus/test/browser';

import { worker } from '#mock/browser';

import { renderWithProviders } from './render-with';

export const test = baseTest
  // We need this disable. Test can't run if we do an underscore variable
  // oxlint-disable-next-line eslint/no-empty-pattern
  .extend('worker', { auto: true }, async ({}, { onCleanup }) => {
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
