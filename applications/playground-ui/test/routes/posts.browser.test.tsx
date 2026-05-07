import { describe, expect } from 'vite-plus/test';

import { errorHandlers } from '#mock/handlers/posts';
import { PostsComponent } from '#src/routes/posts/-common/posts-component';
import { test } from '#test/util';

describe('postsComponent', () => {
  test('renders the posts list on success', async ({ page, renderWithProviders }) => {
    const { baseElement } = await renderWithProviders(<PostsComponent />);

    const screen = page.elementLocator(baseElement);

    await expect.element(screen.getByText('Posts')).toBeVisible();
    await expect.element(screen.getByText('First Post')).toBeVisible();
    await expect.element(screen.getByText('Second Post')).toBeVisible();
    await expect.element(screen.getByText('Third Post')).toBeVisible();
  });

  test('renders the error state when the API fails', async ({ page, renderWithProviders, worker }) => {
    worker.use(errorHandlers.getPosts);

    const { baseElement } = await renderWithProviders(<PostsComponent />);

    const screen = page.elementLocator(baseElement);

    await expect.element(screen.getByText(/failed to fetch posts/i)).toBeVisible();
  });
});
