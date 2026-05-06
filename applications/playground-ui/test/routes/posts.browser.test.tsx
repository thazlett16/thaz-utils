import { describe, expect, it } from 'vitest';

import { worker } from '#mock/browser';
import { errorHandlers } from '#mock/handlers/posts';
import { PostsComponent } from '#src/routes/posts/-common/posts-component';
import { renderWithProviders } from '#test/util';

describe('postsComponent', () => {
  it('renders the posts list on success', async () => {
    const screen = await renderWithProviders(<PostsComponent />);

    await expect.element(screen.getByTestId('posts-container')).toBeVisible();
    await expect.element(screen.getByTestId('posts-list')).toBeVisible();
    await expect.element(screen.getByText('First Post')).toBeVisible();
    await expect.element(screen.getByText('Second Post')).toBeVisible();
    await expect.element(screen.getByText('Third Post')).toBeVisible();
  });

  it('renders the error state when the API fails', async () => {
    worker.use(errorHandlers.getPosts);

    const screen = await renderWithProviders(<PostsComponent />);

    await expect.element(screen.getByTestId('posts-error')).toBeVisible();
    await expect.element(screen.getByText(/failed to fetch posts/i)).toBeVisible();
  });

  it('renders error state via handlers option', async () => {
    const screen = await renderWithProviders(<PostsComponent />, {
      handlers: [errorHandlers.getPosts],
    });

    await expect.element(screen.getByTestId('posts-error')).toBeVisible();
  });
});
