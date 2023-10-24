import { Container, Service, Token } from 'internal:typedi';
import { GH_UPSTREAM, createTestNameFromGitHubIssue } from '../../../utils/create-test-name-from-github-issue.util';

const TEST_NAME = createTestNameFromGitHubIssue({
  id: 48,
  summary: 'Token service IDs in the default container are not inherited by children',
  repository: GH_UPSTREAM
});

describe(TEST_NAME, () => {
    beforeEach(() => Container.reset({ strategy: 'resetValue' }));
  
    it('should work properly', function () {
      let poloCounter = 0;
  
      const FooServiceToken = new Token<FooService>();
  
      @Service({ id: FooServiceToken }, [])
      class FooService implements FooService {
        public marco() {
          poloCounter++;
        }
      }
  
      const scopedContainer = Container.of('myScopredContainer');
      const rootInstance = Container.get(FooServiceToken);
      const scopedInstance = scopedContainer.get(FooServiceToken);
  
      rootInstance.marco();
      scopedInstance.marco();
  
      expect(poloCounter).toBe(2);
    });
  });