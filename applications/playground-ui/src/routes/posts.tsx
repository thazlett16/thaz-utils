import { createFileRoute } from '@tanstack/react-router';

import { PostsComponent } from './posts/-common/posts-component';

export const Route = createFileRoute('/posts')({
  component: PostsComponent,
});
