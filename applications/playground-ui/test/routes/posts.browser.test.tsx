import { describe, expect } from 'vite-plus/test';

import { errorHandlers } from '#mock/handlers/posts';
import { PostsComponent } from '#src/routes/posts/-common/posts-component';
import { test, testViewPorts } from '#test/util';

describe('postsComponent', () => {
  test.for(testViewPorts)(
    '$width x $height - renders the posts list on success',
    async ({ width, height }, { page, renderWithProviders }) => {
      await page.viewport(width, height);

      const { screen } = await renderWithProviders(<PostsComponent />);

      await expect.element(screen.getByText('Posts')).toBeVisible();
      await expect.element(screen.getByText('First Post', { exact: true })).toBeVisible();
      await expect.element(screen.getByText('Second Post', { exact: true })).toBeVisible();
      await expect.element(screen.getByText('Third Post', { exact: true })).toBeVisible();
    },
  );

  test.for(testViewPorts)(
    '$width x $height - renders the error state when the API fails',
    async ({ width, height }, { page, renderWithProviders, worker }) => {
      await page.viewport(width, height);

      worker.use(errorHandlers.getPosts);

      const { screen } = await renderWithProviders(<PostsComponent />);

      await expect.element(screen.getByText(/failed to fetch posts/i)).toBeVisible();
    },
  );
});
