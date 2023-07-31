import { Token } from '@typed-inject/injector';

export interface Post {
  id: number;
  username: string;
  post: string;
}

export const POSTS = new Token<Post[]>('All posts for logged-in users.');
