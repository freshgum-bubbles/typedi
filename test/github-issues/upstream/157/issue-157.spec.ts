import { Container, Service } from 'internal:typedi';
import { GH_UPSTREAM, createTestNameFromGitHubIssue } from '../../../utils/create-test-name-from-github-issue.util';

const TEST_NAME = createTestNameFromGitHubIssue({
  id: 157,
  summary: 'Container.reset should not break transient services',
  repository: GH_UPSTREAM
});

describe(TEST_NAME, function () {
  beforeEach(() => Container.reset({ strategy: 'resetValue' }));

  it('should work properly', () => {
    let creationCounter = 0;

    @Service({ scope: 'transient' }, [])
    class TransientService {
      public constructor() {
        creationCounter++;
      }
    }

    Container.get(TransientService);
    Container.get(TransientService);

    expect(creationCounter).toBe(2);

    Container.reset({ strategy: 'resetValue' });

    Container.get(TransientService);
    Container.get(TransientService);

    expect(creationCounter).toBe(4);
  });
});
