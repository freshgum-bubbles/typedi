// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';

// Custom components:
import GitHubRefLink from './GitHubRefLink';
import CodeBlock from './CodeBlock';

import WorkInProgress from './WorkInProgress';
import NPMInstallBlock from './NPMInstallBlock';

import Root from './Root';

export default {
  // Re-use the default mapping
  ...MDXComponents,
  GitHubRefLink,
  CodeBlock,
  Root,
  WorkInProgress,
  NPMInstallBlock
};