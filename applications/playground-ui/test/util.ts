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

export const testViewPorts = [
  // Large Screen
  { width: 2560, height: 1440 },
  // Desktop Standard
  { width: 1920, height: 1080 },
  // IPad Mini
  { width: 768, height: 1024 },
  // IPhone Mini
  { width: 375, height: 667 },
];
