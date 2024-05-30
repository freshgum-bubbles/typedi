import { inspect } from 'node:util';
import { Container, ContainerInstance, HostContainer, Token } from 'internal:typedi';
import { ExecutableToken, isExecutableToken } from 'internal:typedi/executable-token.class.mjs';
import { EXECUTABLE_TOKEN, ExecutableTokenStamp } from 'internal:typedi/constants/stamps/executable-token.const.mjs';
import { hasOwnProperty } from '../utils/has-own-property.util';

class MyExecutableToken extends ExecutableToken<string> {
  execute(subject: ContainerInstance): string {
    return 'hello world';
  }
}

class MyMockExecutableToken extends ExecutableToken<null> {
  execute = jest.fn().mockReturnValue(null);
}

describe('isExecutableToken', () => {
  test('it should be a function', () => {
    expect(typeof isExecutableToken).toBe('function');
  });

  test.each([{ token: HostContainer() }])('it returns true for $token.name', ({ token }) => {
    expect(isExecutableToken(token)).toBe(true);
  });

  const FALSE_CASES = [
    // May have gone a BIT overboard here...
    { value: 1 },
    { value: null },
    { value: undefined },
    { value: {} },
    { value: [] },
    { value: Symbol() },
    { value: class {}, name: 'an anonymous class' },
    { value: new Token(), name: 'an ordinary Token' },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    { value: function () {}, name: 'an anonymous function' },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    { value: () => {}, name: 'an anonymous arrow function' },
  ].map(x => ({ ...x, name: x.name ?? inspect(x.value) }));

  test.each(FALSE_CASES)('it returns false for $name', ({ value }) => {
    expect(isExecutableToken(value)).toBe(false);
  });

  test('it returns true for Executable Tokens', () => {
    expect(isExecutableToken(new MyExecutableToken())).toBe(true);
  });
});

describe('ExecutableToken', () => {
  let anonymousToken!: MyExecutableToken;
  beforeEach(() => (anonymousToken = new MyExecutableToken()));

  describe('the [EXECUTABLE_TOKEN] property', () => {
    test('ExecutableToken has this member set to the expected value', () => {
      expect(anonymousToken[EXECUTABLE_TOKEN]).toStrictEqual(ExecutableTokenStamp.Generic);
      expect(hasOwnProperty(anonymousToken, EXECUTABLE_TOKEN)).toBe(true);
    });

    test('Token does not have this member', () => {
      const ordinaryToken = new Token();
      expect((ordinaryToken as any)[EXECUTABLE_TOKEN]).toBeUndefined();
      expect(hasOwnProperty(ordinaryToken, EXECUTABLE_TOKEN)).toBe(false);
    });
  });

  test('it should have a name, just like regular Tokens', () => {
    const NAME = 'NAME';
    const namedToken = new MyExecutableToken(NAME);
    expect(namedToken.name).toStrictEqual(NAME);
  });

  test('it should be passed the correct container parameter', () => {
    const mockToken = new MyMockExecutableToken();
    const myContainer = Container.of(Symbol());
    const { execute: executeFn } = mockToken;

    expect(myContainer.get(mockToken)).toBe(null);
    expect(executeFn).toHaveBeenCalledTimes(1);
    expect(executeFn).toHaveBeenCalledWith(myContainer);
  });
});
