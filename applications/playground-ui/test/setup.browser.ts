import { afterEach, afterAll, beforeAll } from 'vitest';

import { worker } from '#mock/browser';

beforeAll(async () => {
  await worker.start({ onUnhandledRequest: 'warn' });
});

afterEach(() => {
  worker.resetHandlers();
});

afterAll(() => {
  worker.stop();
});
