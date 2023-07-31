import React from 'react';
// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';

// Custom components:
import GitHubRefLink from './GitHubRefLink';
import { CodeBlockWrapper as CodeBlock } from './CodeBlock';

import { WorkInProgress } from './WorkInProgress';
import { NPMInstallBlock } from './NPMInstallBlock';

export default {
  // Re-use the default mapping
  ...MDXComponents,
  GitHubRefLink,
  CodeBlock,
  WorkInProgress,
  NPMInstallBlock
};