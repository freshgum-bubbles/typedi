import { Container, Lazy, Service } from 'internal:typedi';

describe('Lazy()', function () {
  let emptyFunction = () => {};
  it('should accept a function and return an object', () => {
    expect(() => Lazy(emptyFunction)).not.toThrowError();
    expect(Lazy(emptyFunction)).toBeInstanceOf(Object);
  });

  it('should be usable as a service dependency', () => {
    @Service([])
    class AnotherService {}

    @Service([Lazy(() => AnotherService)])
    class MyService {
      constructor(public receivedValue: unknown) {}
    }

    expect(Container.get(MyService).receivedValue).toBeInstanceOf(AnotherService);
  });
});
