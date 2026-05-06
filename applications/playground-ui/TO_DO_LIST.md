# TO_DO_LIST

Potential improvements to consider after the initial test setup.

## Testing Infrastructure

- **Route-level integration tests**: Test the full route lifecycle (loader, `beforeLoad`, pending component) by rendering `<RouterProvider>` with a memory history pointing to the target route instead of rendering the component in isolation with `RouterContextProvider`. This exercises TanStack Router's loader and error boundary machinery.

- **Loading state tests**: The `posts-loading` testid is hard to assert in fast environments since MSW resolves immediately. Consider using MSW response delays (`HttpResponse.delay()`) or Vitest fake timers to assert loading states.

- **Navigation tests**: Use the `history` returned from `renderWithProviders` to push new entries and assert that the component responds correctly to route changes.

- **Coverage thresholds**: Add `coverage.thresholds` to `vite.config.ts` once meaningful coverage exists (e.g., `lines: 80, branches: 80`).

## Mock Handlers

- **POST/PATCH/DELETE handlers**: Add mutation handlers for posts and users (create, update, delete) so form-submission flows can be tested end-to-end with MSW.

- **Single-item route (`/posts/:id`)**: Wire up the existing `getPostByIdHandler` to a detail route and write tests for the 404 case.

- **Shared mock data module**: Extract `MOCK_POSTS` and `MOCK_USERS` into a `mock/data/` directory so tests can import the same fixtures and assert against known values without duplicating them.

## Routes and Components

- **Users route**: Create `src/routes/users.tsx` following the same pattern as posts, exercising the users MSW handlers and the `usersQueryOptions`.

- **Form route with mutation**: Add a `src/routes/posts/new.tsx` route with a TanStack Form that POSTs to `/api/posts`. Test that the form submits, the handler is called, and the success/error UI is shown.

- **Error boundary at route level**: Move error UI out of the component into TanStack Router's `errorComponent` option so error handling is consistent across routes and can be tested via the router.

## Type Safety

- **Typed API with ts-rest**: The workspace already has `@ts-rest/core` in the catalog. Consider defining a contract for the mock API so both the fetch calls and MSW handlers share the same schema — eliminating the manual `Post` / `User` interface duplication between `src/routes/` and `mock/handlers/`.
