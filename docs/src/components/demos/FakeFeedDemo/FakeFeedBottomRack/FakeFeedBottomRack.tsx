import React, { useRef } from 'react';

import styles from './FakeFeedBottomRack.module.css';

export interface Props {
    onNewMessage?(messageText: string, e: React.FormEvent<HTMLFormElement>): void;
}

export function FakeFeedBottomRack (props: Props) {
    const inputRef = useRef<HTMLInputElement>();

    return (
        <div className={styles.bottomRack}>
            <form className={styles.messageForm} onSubmit={e => {
                const inputEl = inputRef.current;

                e.preventDefault();
                e.stopPropagation();
                props.onNewMessage?.(inputEl.value, e);

                /** Clear the input for subsequent values. */
                inputEl.value = '';
            }}>
                <input type="text" className={styles.messageInput} placeholder="Enter a message..." ref={inputRef} />
            </form>
        </div>
    )
}