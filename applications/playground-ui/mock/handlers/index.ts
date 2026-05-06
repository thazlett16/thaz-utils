import { handlers as postsHandlers } from './posts';
import { handlers as usersHandlers } from './users';

export const handlers = [...postsHandlers, ...usersHandlers];
