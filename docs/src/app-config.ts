import { DocusaurusConfig, DocusaurusContext } from '@docusaurus/types';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

interface APIReferenceCustomField {
  location: string;
  link: string;
}

/**
 * Create a custom type extending the default Docusuaurus
 * config type to make using custom fields easier.
 */
export interface AppConfig extends DocusaurusConfig {
  customFields: {
    apiReference: APIReferenceCustomField;
    github: {
      /**
       * A string which references a GitHub repository.
       *
       * @example
       * "freshgum-bubbles/typedi"
       */
      repoPath: string;
    };
    changelog: {
      link: string;
    };
  };
}

export type AppConfigCustomFields = AppConfig['customFields'];

export interface AppContext extends DocusaurusContext {
  siteConfig: AppConfig;
}

export function useAppContext(...args: Parameters<typeof useDocusaurusContext>): AppContext {
  /**
   * While the `useDocusaurusContext` hook does not *currently* take arguments,
   * we pass them in anyway to ensure compatibility with any future renditions which do.
   */
  return useDocusaurusContext(...args) as unknown as AppContext;
}
