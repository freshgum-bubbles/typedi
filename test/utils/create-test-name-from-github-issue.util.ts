export interface GitHubRepositoryDescriptor {
  readonly owner: string;
  readonly name: string;
}

export interface GitHubIssueDescriptor {
  readonly id: number;
  readonly summary: string;
  readonly repository: GitHubRepositoryDescriptor;
}

export const GH_UPSTREAM: GitHubRepositoryDescriptor = {
  owner: 'typestack',
  name: 'typedi',
};

export const GH_THIS: GitHubRepositoryDescriptor = {
  owner: 'freshgum-bubbles',
  name: 'typedi',
};

export function createTestNameFromGitHubIssue(issue: GitHubIssueDescriptor) {
  const {
    repository: { name, owner },
    id,
    summary,
  } = issue;
  return `GH(${owner}/${name}#${id}): ${summary}`;
}
