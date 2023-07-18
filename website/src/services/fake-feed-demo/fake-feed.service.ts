import { Service } from '@typed-inject/injector';
import { POSTS, Post } from './posts.token';
import { FEED_USERNAME } from './username.token';

let nextPostId = 0;

export class FeedService extends EventTarget {
  constructor(private username: string, private posts: Post[]) {
    super();
  }

  addPost(post: string) {
    this.posts.push({ username: this.username, post, id: ++nextPostId });
    this.dispatchEvent(new CustomEvent('post-added') as Event);
  }
}

/** Babel doesn't like decorators for some reason. */
Service([FEED_USERNAME, POSTS])(FeedService);
