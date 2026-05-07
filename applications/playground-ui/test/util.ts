import { test as baseTest } from 'vite-plus/test';
import { page, userEvent } from 'vite-plus/test/browser';

import { worker } from '#mock/browser';

import { renderWithProviders } from './render-with';

let workerStarted = false;

const VIEW_PORT_OPTIONS = {
  LARGE: { width: 2560, height: 1440 },
  DESKTOP: { width: 1920, height: 1080 },
  IPAD_MINI: { width: 768, height: 1024 },
  IPHONE_MINI: { width: 375, height: 667 },
};

export const test = baseTest
  // We need this disable. Test can't run if we do an underscore variable and there is nothing in context that we need
  // oxlint-disable-next-line eslint/no-empty-pattern
  .extend('worker', { auto: true }, async ({}, { onCleanup }) => {
    if (!workerStarted) {
      await worker.start({ quiet: true });
      workerStarted = true;
    }

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
  })
  .extend('VIEW_PORT_OPTIONS', () => {
    return VIEW_PORT_OPTIONS;
  });

export const TEST_VIEW_PORT_OPTIONS = [
  VIEW_PORT_OPTIONS.LARGE,
  VIEW_PORT_OPTIONS.DESKTOP,
  VIEW_PORT_OPTIONS.IPAD_MINI,
  VIEW_PORT_OPTIONS.IPHONE_MINI,
];
