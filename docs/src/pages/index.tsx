import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import styles from './index.module.css';
import { useAppContext } from '../app-config';
import { HomeIntro } from '../components/HomeIntro/HomeIntro';

function HomepageHeader() {
  const {siteConfig} = useAppContext();
  return (
    <header className={clsx('hero shadow--lw', styles.heroBanner)}>
      <div className="container">
        <h1 className={styles.hero__title}>{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/getting-started">
            Getting Started
          </Link>
          <Link
            className="button button--secondary button--lg"
            to={siteConfig.customFields.apiReference.link}>
              API Reference
            </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useAppContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        {/* <HomepageFeatures /> */}
        <HomeIntro />
      </main>
    </Layout>
  );
}
