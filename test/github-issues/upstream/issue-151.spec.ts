import { Container, Service } from 'internal:typedi';
import { GH_UPSTREAM, createTestNameFromGitHubIssue } from '../../utils/create-test-name-from-github-issue.util';

const TEST_NAME = createTestNameFromGitHubIssue({
  id: 151,
  summary: 'Unable to define type when setting service',
  repository: GH_UPSTREAM
});

describe(TEST_NAME, function () {
  beforeEach(() => Container.reset({ strategy: 'resetValue' }));

  it('should work properly', () => {
    /**
     * Note: This is more like a behavioral test the use-case showcased below
     * should be always possible, even if the API changes.
     */
    @Service([])
    class AuthService {
      isAuthorized() {
        return 'nope';
      }
    }

    @Service([AuthService])
    class DataService {
      constructor(public authService: AuthService) {}
    }

    @Service([AuthService])
    class FakeDataService {
      constructor(public authService: AuthService) {}
    }

    Container.set({ id: DataService, type: FakeDataService, dependencies: [AuthService] });

    const instance = Container.get<FakeDataService>(DataService as any);

    expect(instance).toBeInstanceOf(FakeDataService);
    expect(instance.authService).toBeInstanceOf(AuthService);
    expect(instance.authService.isAuthorized()).toBe('nope');
  });
});
