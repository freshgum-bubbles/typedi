import React from 'react';
import { Post } from '@site/src/services/fake-feed-demo/posts.token';

import styles from './FakePost.module.css';

export interface Props {
  post: Post;
  key?: React.Key;
  isListItem?: boolean;
}

export function FakePost({ post, key, isListItem = false }: Props) {
  return (
    <div
      className={styles.fakePost}
      key={key}
      role="listitem"
      aria-label="Example of a post made using the FeedService"
    >
      <p className={styles.messageContent}>
        <span className={styles.messageAuthor}>{post.username}</span>
        <span className={styles.messageContent}>{post.post}</span>
      </p>
    </div>
  );
}
