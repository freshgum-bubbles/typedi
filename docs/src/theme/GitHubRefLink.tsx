import React from 'react';
import Link, { Props as LinkProps } from '@docusaurus/Link';
import { useAppContext } from '@site/src/app-config';

export type GitHubRefNodeType =
  | 'issue' 
  | 'pull-request'
  | 'discussion';

export interface GitHubRefLinkProps {
  /**
   * A string which references a GitHub repository.
   * 
   * @example
   * "freshgum-bubbles/typedi"
   */
  repoPath?: string;

  /** The number of the issue. */
  nodeID: number;

  /** The type of the item. */
  type: GitHubRefNodeType;
}

function getLinkForNode (type: GitHubRefNodeType, nodeID: number) {
  switch (type) {
    case 'issue':
      return `/issues/${nodeID}`;
    case 'pull-request':
      return `/pull/${nodeID}`;
    case 'discussion':
      return `/discussions/${nodeID}`;
    default:
      throw new Error(`<GitHubRefLink />: Unexpected node type: ${type} with ID ${nodeID}.`);
  }
}

export default function GitHubRefLink({ repoPath: baseRepoPath, type, nodeID, ...rest }: GitHubRefLinkProps & Omit<LinkProps, 'children'>) {
  const { siteConfig } = useAppContext();
  const repoPath = baseRepoPath ?? siteConfig.customFields.github.repoPath;
  const link = getLinkForNode(type, nodeID);

  return (
    <Link to={`https://github.com/${repoPath}${link}`} {...rest}>
      {repoPath}#{nodeID}
    </Link>
  );
}
