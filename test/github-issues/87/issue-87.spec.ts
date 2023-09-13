import { Container, Service, ServiceNotFoundError } from 'internal:typedi';

describe('Github Issues', function () {
  beforeEach(() => Container.reset({ strategy: 'resetValue' }));

  it('#87 - TypeDI should throw error if a dependency is not found', () => {
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
