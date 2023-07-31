import { GREETING_USERNAME } from '@site/src/services/username-demo/username.token';
import Container from '@typed-inject/injector';
import React, { useMemo, useRef } from 'react';
import { useState } from 'react';

import styles from './GreetingDemo.module.css';
import clsx from 'clsx';
import { GreetingService } from '@site/src/services/username-demo/greeting.service';

export function GreetingDemo() {
  const [userName, setUserName] = useState<string>();
  const greetingService = useMemo(() => {
    /** If the input is "", let's remove it from the container so the default string is shown. */
    if (userName === '') {
        Container.remove(GREETING_USERNAME);
    } else {
        Container.set({ id: GREETING_USERNAME, value: userName, dependencies: [] });
    }

    return Container.get(GreetingService);
  }, [userName]);
  const inputRef = useRef<HTMLInputElement>();

  return (
    <div className={clsx(styles.greetingDemo, 'shadow--tl')}>
      <div className={clsx(styles.serviceOutput, styles.layoutPartition)}>
        <p className={styles.serviceOutputText}>{greetingService.getGreeting()}</p>
      </div>
      <form className={clsx(styles.usernameForm, styles.layoutPartition)}>
        <input
          type="text"
          placeholder="What's your name?"
          className={styles.nameInput}
          ref={inputRef}
          onInput={() => setUserName(inputRef.current.value)}
        />
      </form>
    </div>
  );
}
