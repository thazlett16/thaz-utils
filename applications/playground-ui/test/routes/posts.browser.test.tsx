import { describe, expect } from 'vitest';

import { errorHandlers } from '#mock/handlers/posts';
import { PostsComponent } from '#src/routes/posts/-common/posts-component';
import { test } from '#test/util';

describe('postsComponent', () => {
  test('renders the posts list on success', async ({ renderWithProviders }) => {
    const screen = await renderWithProviders(<PostsComponent />);

    await expect.element(screen.getByTestId('posts-container')).toBeVisible();
    await expect.element(screen.getByTestId('posts-list')).toBeVisible();
    await expect.element(screen.getByText('First Post')).toBeVisible();
    await expect.element(screen.getByText('Second Post')).toBeVisible();
    await expect.element(screen.getByText('Third Post')).toBeVisible();
  });

  test('renders the error state when the API fails', async ({ renderWithProviders, worker }) => {
    worker.use(errorHandlers.getPosts);

    const screen = await renderWithProviders(<PostsComponent />);

    await expect.element(screen.getByTestId('posts-error')).toBeVisible();
    await expect.element(screen.getByText(/failed to fetch posts/i)).toBeVisible();
  });

  test('renders error state via handlers option', async ({ renderWithProviders, worker }) => {
    worker.use(errorHandlers.getPosts);

    const screen = await renderWithProviders(<PostsComponent />);

    await expect.element(screen.getByTestId('posts-error')).toBeVisible();
  });
});
