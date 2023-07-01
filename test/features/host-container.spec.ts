import { Container, HostContainer, Token, Service, ContainerInstance } from '../../src/index';

describe('HostContainer', function () {
  it('returns a token', function () {
    expect(HostContainer()).toBeInstanceOf(Token);
  });

  it('has a constant return value with subsequent calls', function () {
    for (let index = 0; index >= 10; index++) {
      expect(HostContainer()).toStrictEqual(Container);
    }
  });

  /**
   * Just to be extra sure it resolves correctly in all situations,
   * we make use of describe.each to run over it being used in three cases:
   *   - The default container
   *   - An orphaned container
   *   - A child container
   */
  describe.each([
    { name: 'Default Container', container: Container },
    { name: 'Orphaned Container', container: ContainerInstance.of(Symbol(), null) },
    { name: 'Child Container', container: Container.ofChild(Symbol()) },
  ])('$name: HostContainer usage', ({ container }) => {
    it('returns the host container', function () {
      expect(container.get(HostContainer())).toStrictEqual(container);
    });

    it('always resolves with .get', function () {
      expect(container.get(HostContainer())).toStrictEqual(container);
    });

    it('always resolves with .getOrNull', function () {
      expect(container.getOrNull(HostContainer())).toStrictEqual(container);
    });

    it('resolves as a service dependency', function () {
      @Service({ container }, [HostContainer()])
      class MyService {
        constructor(public receivedValue: any) {}
      }

      const myService = container.get(MyService);
      expect(myService.receivedValue).toStrictEqual(container);
    });

    it('returns true when passed to .has', function () {
      expect(container.has(HostContainer())).toStrictEqual(true);
    });

    it('does not resolve in "many" functions', function () {
      expect(() => container.getMany(HostContainer())).toThrowError();
      expect(container.getManyOrNull(HostContainer())).toBeNull();
    });
  });
});
