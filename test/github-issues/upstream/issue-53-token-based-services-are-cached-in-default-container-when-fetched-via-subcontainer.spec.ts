import { Container, Service, Token } from 'internal:typedi';
import { GH_UPSTREAM, createTestNameFromGitHubIssue } from '../../utils/create-test-name-from-github-issue.util';

const TEST_NAME = createTestNameFromGitHubIssue({
  id: 53,
  summary: 'Token-based services are cached in the default container, even when fetched via a subcontainer',
  repository: GH_UPSTREAM,
});

describe(TEST_NAME, function () {
  beforeEach(() => Container.reset({ strategy: 'resetValue' }));

  it('should work properly', function () {
    @Service([])
    class QuestionRepository {
      userName!: string;

      save() {
        return null;
      }
    }

    const QuestionControllerToken = new Token<QuestionControllerImpl>('QCImpl');

    @Service({ id: QuestionControllerToken }, [QuestionRepository])
    class QuestionControllerImpl {
      constructor(protected questionRepository: QuestionRepository) {}

      save(name: string) {
        if (name) this.questionRepository.userName = name;
        this.questionRepository.save();
      }
    }

    const request1 = 'REQUEST_1';
    const controller1 = Container.of(request1).get(QuestionControllerToken);
    controller1.save('Timber');
    Container.reset({ strategy: 'resetValue' });

    const request2 = 'REQUEST_2';
    const controller2 = Container.of(request2).get(QuestionControllerToken);
    controller2.save('John');
    Container.reset({ strategy: 'resetValue' });

    expect(controller1).not.toBe(controller2);
    expect(controller1).not.toBe(Container.get(QuestionControllerToken));
  });
});
