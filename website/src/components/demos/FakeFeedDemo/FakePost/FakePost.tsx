import React from 'react';
import { Post } from "@site/src/services/fake-feed-demo/posts.token";

import styles from './FakePost.module.css';

export interface Props {
    post: Post;
}

export function FakePost ({ post }: Props) {
    return (
        <div className={styles.fakePost}>
            <p className={styles.messageContent}>
               <span className={styles.messageAuthor}>{post.username}</span> 
               <span className={styles.messageContent}>{post.post}</span>
            </p>
        </div>
    )
}