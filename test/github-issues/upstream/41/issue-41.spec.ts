import { Container, Service, Token } from 'internal:typedi';
import { GH_UPSTREAM, createTestNameFromGitHubIssue } from '../../../utils/create-test-name-from-github-issue.util';

const TEST_NAME = createTestNameFromGitHubIssue({
  id: 41,
  summary: 'Possible to use tokens as service ID in combination with factory',
  repository: GH_UPSTREAM
});

describe(TEST_NAME, function () {
  beforeEach(() => Container.reset({ strategy: 'resetValue' }));

  it('should work properly', function () {
    interface SomeInterface {
      foo(): string;
    }
    const SomeInterfaceToken = new Token<SomeInterface>();

    @Service([])
    class SomeInterfaceFactory {
      create() {
        return new SomeImplementation();
      }
    }

    @Service(
      {
        id: SomeInterfaceToken,
        factory: [SomeInterfaceFactory, 'create'],
      },
      []
    )
    class SomeImplementation implements SomeInterface {
      foo() {
        return 'hello implementation';
      }
    }

    Container.set({ id: 'moment', value: 'A', dependencies: [] });
    Container.set({ id: 'jsonwebtoken', value: 'B', dependencies: [] });
    Container.set({ id: 'cfg.auth.jwt', value: 'C', dependencies: [] });
    const someInterfaceImpl = Container.get(SomeInterfaceToken);
    expect(someInterfaceImpl.foo()).toBe('hello implementation');
  });
});
