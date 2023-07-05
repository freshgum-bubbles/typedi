import React, { useEffect, useLayoutEffect, useRef } from 'react';

import { POSTS, Post } from "@site/src/services/fake-feed-demo/posts.token";
import { useService } from "@site/src/typedi-hooks";
import { useForceRender } from "@site/src/util-hooks";
import Container from "@typed-inject/injector";

import styles from './FakeFeedDemo.module.css';
import { FakePost } from './FakePost/FakePost';
import { FakeFeedBottomRack } from './FakeFeedBottomRack/FakeFeedBottomRack';
import clsx from 'clsx';
import { FeedService } from '@site/src/services/fake-feed-demo/fake-feed.service';
import { FEED_USERNAME } from '@site/src/services/fake-feed-demo/username.token';

const posts: Post[] = [
    { username: 'freshgum', post: 'hello! :-)' },
    { username: 'freshgum', post: 'type something here!' }
];

if (!Container.has(POSTS)) {
    Container.set({ id: POSTS, value: [
        { username: 'freshgum', post: 'hello! :-)' },
        { username: 'freshgum', post: 'try typing here!' }
    ], dependencies: [ ] });
}

if (!Container.has(FEED_USERNAME)) {
    Container.set({ id: FEED_USERNAME, value: 'you', dependencies: [ ] });
}

export function FakeFeedDemo () {
    /** We need to force renders here as the POSTS are mutated in-place. */
    const [forceRender] = useForceRender();
    const [feedService] = useService<FeedService>(FeedService);
    const [posts] = useService<Post[]>(POSTS);
    const fakeChatListRef = useRef<HTMLDivElement>();
    const shouldScrollToBottomRef = useRef(false);

    useEffect(() => {
        /**
         * When a post has been added, we update a ref to signal to the next render
         * that the view should be scrolled to the bottom.
         * 
         * This is then handled by `useLayoutEffect`, which runs **after DOM mutations**.
         * This means that it runs *after* the chat message has been added, allowing us
         * to compute the appropriate position to scroll to.
         * 
         * On each render, the "should scroll" ref is listened to and, if its value is 
         * updated, it scrolls the view to the bottom and resets the ref to `false`.
         */
        feedService.addEventListener('post-added', () => {
            forceRender();
            shouldScrollToBottomRef.current = true;
        });
    }, [ ]);

    useLayoutEffect(() => {
        const shouldScroll = shouldScrollToBottomRef.current;
        
        if (shouldScroll) {
            shouldScrollToBottomRef.current = false;
            fakeChatListRef.current.scrollTop = fakeChatListRef.current.scrollHeight;
        }
        /**
         * Note: While I'd prefer to have the scrolling ref as a dependency that is checked
         * by React, it looks like that's not possible.
         * If we add its `current` to the dependencies array, the code above doesn't run.
         */
    });

    function addPost (messageText: string) {
        feedService.addPost(messageText);
    }

    return (
        <div className={ styles.fakeFeed}>
            <div className={clsx(styles.fakeFeedContent, 'shadow--tl')}>
                <div className={clsx(styles.roundedHeavy, styles.contentGrow)}>
                    <div className={styles.fakeChatList} ref={fakeChatListRef}>
                        {posts.map(post => (
                            <FakePost post={post} key={post.id} />
                        ))}
                    </div>
                </div>
                <FakeFeedBottomRack onNewMessage={addPost} />
            </div>
        </div>
    )
}