import {
  // Functions prefixed with `base*` to make accidental usage in test cases harder.
  Lazy as baseLazy,
  forwardRef as baseForwardRef,

  Container,
  Service,
  ServiceIdentifier,
  SkipSelf,
  Token,
} from 'internal:typedi';

describe.each([
  { fn: baseLazy, name: 'Lazy' },
  { fn: baseForwardRef, name: 'forwardRef' },
])('$name(...)', function ({ fn }) {
  /**
   * Create an empty function just to test the interface.
   * This would obviously never work in usage.
   */
  let emptyFunction = (): ServiceIdentifier => undefined as unknown as ServiceIdentifier;

  it('should accept a function and return an object', () => {
    expect(() => fn(emptyFunction)).not.toThrowError();
    expect(fn(emptyFunction)).toBeInstanceOf(Object);
  });

  it('should be usable as a service dependency', () => {
    @Service([])
    class AnotherService {}

    @Service([fn(() => AnotherService)])
    class MyService {
      constructor(public receivedValue: unknown) {}
    }

    expect(Container.get(MyService).receivedValue).toBeInstanceOf(AnotherService);
  });

  it('should be compatible with resolution constraints', () => {
    const LOCATION = new Token<Location>();

    enum Location {
      Parent = 'parent',
      Child = 'child',
    }

    @Service([[fn(() => LOCATION), SkipSelf()], fn(() => LOCATION)])
    class MyService {
      constructor(
        public skipSelfLocation: Location,
        public selfLocation: Location
      ) {}
    }

    Container.setValue(LOCATION, Location.Parent);

    const childContainer = Container.ofChild(Symbol());
    childContainer.setValue(LOCATION, Location.Child);

    expect(childContainer.get(MyService).skipSelfLocation).toStrictEqual(Location.Parent);
    expect(childContainer.get(MyService).selfLocation).toStrictEqual(Location.Child);
  });
});
