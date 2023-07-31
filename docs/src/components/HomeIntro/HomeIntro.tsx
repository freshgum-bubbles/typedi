import React from 'react';
import clsx from 'clsx';
import CodeBlock from '@theme/CodeBlock';
import Details from '@theme/Details';

import styles from './HomeIntro.module.css';
import { FakeFeedDemo } from '../demos/FakeFeedDemo/FakeFeedDemo';
import { GreetingDemo } from '../demos/GreetingDemo/GreetingDemo';

export const FEED_SERVICE_EXAMPLE_CODE = `\
@Service([USERNAME, POSTS])
export class FeedService extends EventTarget {
    constructor (private username: string, private posts: Post[]) {
        super();
    }

    addPost (post: string) {
        this.posts.push({ username: this.username, post });
        this.dispatchEvent(new CustomEvent('post-added'));
    }
}`;

export const ANGULAR_ESQUE_EXAMPLE_CODE = `\
const USERNAME = new Token<string>();

@Service({ scope: 'transient' }, [
  [USERNAME, Optional()]
])
export class GreetingService {
  constructor (private userName?: string) { }

  getGreeting () {
    return \`Hello, \${this.userName ?? 'person'}!\`;
  }
}
`

export function HomeIntro() {
  return (
    <>
      <div className={styles.featureList}>
        <div className={clsx(styles.featureListItem, styles.featureListItemDemo)}>
          <div className={styles.featureListItemLeadup}>
            <h2 className={styles.leadupHeading}>Injection without the confusion.</h2>
            <p className={styles.leadupSummary}>All through an expressive, decorator-based syntax.</p>
          </div>
          <div className={styles.sideBySide}>
            <div className={styles.explainedCodeBlock}>
              <CodeBlock language="ts" className={clsx(styles.demoCodeBlock, 'shadow--tl')}>
                {FEED_SERVICE_EXAMPLE_CODE}
              </CodeBlock>
              <Details summary="Wondering how this example works?">
                This example uses a combination of the above code and React.
                <br />
                The implementation of this example <a href="https://a.co">can be seen here.</a>
              </Details>
            </div>
            <FakeFeedDemo />
          </div>
          <div className={clsx(styles.featureListItemLeadup, 'margin-top--lg')}>
            <h2 className={styles.leadupHeading}>Angular-esque API</h2>
            <p className={styles.leadupSummary}>
              <p>TypeDI lets you use operators such as <code>SkipSelf</code>, <code>Self</code>, <br />and <code>Optional</code> to change how dependencies are retrieved.</p>
            </p>
          </div>
          <div className={styles.sideBySide}>
            <div className={styles.explainedCodeBlock}>
              <CodeBlock language="ts" className={clsx(styles.demoCodeBlock, 'shadow--tl')}>
                {ANGULAR_ESQUE_EXAMPLE_CODE}
              </CodeBlock>
            </div>
            <GreetingDemo />
          </div>
        </div>
      </div>
    </>
  );
}
