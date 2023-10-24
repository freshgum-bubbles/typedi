import { Container, Service, ServiceNotFoundError } from 'internal:typedi';
import { GH_UPSTREAM, createTestNameFromGitHubIssue } from '../../../utils/create-test-name-from-github-issue.util';

const TEST_NAME = createTestNameFromGitHubIssue({
  id: 87,
  summary: 'The container does not throw an error when a dependency is not found',
  repository: GH_UPSTREAM
});

describe(TEST_NAME, function () {
  beforeEach(() => Container.reset({ strategy: 'resetValue' }));

  it('should work properly', () => {
    @Service([])
    class InjectedClassA {}

    /** This class is not decorated with @Service decorator. */
    class InjectedClassB {}

    @Service([InjectedClassA, InjectedClassB])
    class MyClass {
      constructor(
        private injectedClassA: InjectedClassA,
        private injectedClassB: InjectedClassB
      ) {}
    }

    expect(() => Container.get(MyClass)).toThrow(ServiceNotFoundError);
  });
});
