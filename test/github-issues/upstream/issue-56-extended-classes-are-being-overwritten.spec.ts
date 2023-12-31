import { Container, Service } from 'internal:typedi';
import { GH_UPSTREAM, createTestNameFromGitHubIssue } from '../../utils/create-test-name-from-github-issue.util';

const TEST_NAME = createTestNameFromGitHubIssue({
  id: 56,
  summary: 'Extended classes are being overwritten (?)',
  repository: GH_UPSTREAM,
});

describe(TEST_NAME, function () {
  beforeEach(() => Container.reset({ strategy: 'resetValue' }));

  it('should work properly', function () {
    @Service([])
    class Rule {
      getRule() {
        return 'very strict rule';
      }
    }

    @Service([])
    class Whitelist extends Rule {
      getWhitelist() {
        return ['rule1', 'rule2'];
      }
    }

    const whitelist = Container.get(Whitelist);
    expect(whitelist.getRule).not.toBeUndefined();
    expect(whitelist.getWhitelist).not.toBeUndefined();
    expect(whitelist.getWhitelist()).toEqual(['rule1', 'rule2']);
    expect(whitelist.getRule()).toEqual('very strict rule');

    const rule = Container.get(Rule);
    expect(rule.getRule).not.toBeUndefined();
    expect((rule as Whitelist).getWhitelist).toBeUndefined();
    expect(rule.getRule()).toEqual('very strict rule');
  });
});
