import { Service } from 'internal:typedi';

describe('Service Decorator (ES)', () => {
  it('should be a function', () => {
    expect(typeof Service).toStrictEqual('function');
  });
});
