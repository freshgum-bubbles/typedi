import { Container, Token } from 'internal:typedi';

describe('Container.set without dependencies', () => {
  it('should provide the appropriate overload and function correctly', () => {
    const NAME = new Token<string>();

    Container.set({ id: NAME, value: 'Joanna' });
    expect(Container.has(NAME)).toBe(true);
    expect(Container.get(NAME)).toStrictEqual('Joanna');
  });
});
