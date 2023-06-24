import {
  Container,
  ContainerInstance,
  Many,
  Optional,
  Self,
  SkipSelf,
  ResolutionConstraintFlag,
} from '../../src/index';
import { Service } from '../../src/decorators/service.decorator';

describe('Resolution Constraints', function () {
  beforeEach(() => Container.reset({ strategy: 'resetValue' }));

  describe('Bitmask functions', function () {
    /**
     * Iterate over each flag and flag function to ensure they work correctly.
     * The name is purely there so we can provide pretty test names (as seen below).
     */
    const testMaskFunctions = describe.each([
      { name: 'Many', fn: Many, flag: ResolutionConstraintFlag.Many },
      { name: 'SkipSelf', fn: SkipSelf, flag: ResolutionConstraintFlag.SkipSelf },
      { name: 'Self', fn: Self, flag: ResolutionConstraintFlag.Self },
      { name: 'Optional', fn: Optional, flag: ResolutionConstraintFlag.Optional },
    ]);

    testMaskFunctions('$name()', function ({ fn, flag }) {
      it('should return a number', function () {
        expect(typeof fn()).toStrictEqual('number');
      });

      it('should match the corresponding constraint flag', function () {
        const mask = fn();
        expect(mask).toStrictEqual(flag);
      });

      it('should be bitwise ANDable to the corresponding constraint flag', function () {
        const mask = fn();
        expect(mask & flag).not.toStrictEqual(0);
      });
    });

    testMaskFunctions('ResolutionConstraintFlag.$name', function ({ flag }) {
      it('should be a number', function () {
        expect(typeof flag).toStrictEqual('number');
      });
    });
  });

  describe('ResolutionConstraintFlag', function () {
    it('should map with other flags correctly', function () {
      const bitmask =
        ResolutionConstraintFlag.Many |
        ResolutionConstraintFlag.Optional |
        ResolutionConstraintFlag.Self |
        ResolutionConstraintFlag.SkipSelf;

      expect(bitmask & ResolutionConstraintFlag.Many).not.toStrictEqual(0);
      expect(bitmask & ResolutionConstraintFlag.Optional).not.toStrictEqual(0);
      expect(bitmask & ResolutionConstraintFlag.Self).not.toStrictEqual(0);
      expect(bitmask & ResolutionConstraintFlag.SkipSelf).not.toStrictEqual(0);
    });
  });

  describe('Optional', function () {
    it('should work correctly on its own', function () {
      class ThisWillNotResolve {}

      @Service([[ThisWillNotResolve, Optional()]])
      class MyService {
        constructor(public receivedValue: unknown) {}
      }

      expect(Container.get(MyService).receivedValue).toStrictEqual(null);
    });

    it('should defer back to the actual value if it is present', function () {
      @Service([])
      class ThisWillResolve {}

      @Service([[ThisWillResolve, Optional()]])
      class MyService {
        constructor(public receivedValue: unknown) {}
      }

      expect(Container.get(MyService).receivedValue).toBeInstanceOf(ThisWillResolve);
    });
  });

  describe('SkipSelf', function () {
    it('should skip the value in the current container', function () {
      const childContainer = Container.of(Symbol());

      const mockNeverRunsFn = jest.fn();
      const mockShouldRunFn = jest.fn();

      @Service({ container: childContainer }, [])
      class ThisShouldNeverRun {
        constructor() {
          mockNeverRunsFn();
        }
      }

      /** This will be bound to the default container, which is the parent of childContainer. */
      @Service({ id: ThisShouldNeverRun }, [])
      class ThisShouldRun {
        constructor() {
          mockShouldRunFn();
        }
      }

      @Service([[ThisShouldNeverRun, SkipSelf()]])
      class MyService {
        constructor(public receivedValue: unknown) {}
      }

      const myService = childContainer.get(MyService);

      expect(myService.receivedValue).toBeInstanceOf(ThisShouldRun);
      expect(mockNeverRunsFn).not.toHaveBeenCalled();
      expect(mockShouldRunFn).toHaveBeenCalledTimes(1);
    });

    it('should immediately fail if the container does not have a parent', function () {
      const containerWithNoParent = ContainerInstance.of(Symbol(), null);

      @Service([])
      class AnotherService {}

      @Service({ container: containerWithNoParent }, [[AnotherService, SkipSelf()]])
      class MyService {}

      expect(() => containerWithNoParent.get(MyService)).toThrowError();
    });
  });

  describe('Many', function () {
    it('should return the many instances of the given identifier', function () {
      @Service({ multiple: true }, [])
      class Dependency {}

      @Service([[Dependency, Many()]])
      class MyService {
        constructor(public receivedValue: unknown) {}
      }

      expect(() => Container.get(MyService)).not.toThrowError();

      const { receivedValue } = Container.get(MyService);
      expect(receivedValue).toBeInstanceOf(Array);
      expect((receivedValue as Array<any>).length).toStrictEqual(1);
      expect((receivedValue as Array<any>)[0]).toBeInstanceOf(Dependency);
    });

    it('should throw an error if the identifier cannot be found', function () {
      class Dependency {}

      @Service([[Dependency, Many()]])
      class MyService {
        constructor(public receivedValue: unknown) {}
      }

      expect(() => Container.get(MyService)).toThrowError();
    });

    it('should return null when combined with Optional and the identifier cannot be found', function () {
      class Dependency {}

      @Service([[Dependency, Many() | Optional()]])
      class MyService {
        constructor(public receivedValue: unknown) {}
      }

      expect(() => Container.get(MyService)).not.toThrowError();
      expect(Container.get(MyService).receivedValue).toStrictEqual(null);
    });

    it('should work correctly with Self', function () {
      const childContainer = Container.ofChild(Symbol());

      @Service({ multiple: true }, [])
      class Dependency {}

      @Service({ container: childContainer }, [[Dependency, Many() | Self()]])
      class MyService {
        constructor(public receivedValue: unknown) {}
      }

      expect(() => childContainer.get(MyService)).toThrowError();
    });

    it('should work correctly with SkipSelf', function () {
      const childContainer = Container.ofChild(Symbol());

      const mockNeverRunsFn = jest.fn();
      const mockShouldRunFn = jest.fn();

      @Service({ container: childContainer, multiple: true }, [])
      class ThisShouldNeverRun {
        constructor() {
          mockNeverRunsFn();
        }
      }

      /** This will be bound to the default container, which is the parent of childContainer. */
      @Service({ id: ThisShouldNeverRun, multiple: true }, [])
      class ThisShouldRun {
        constructor() {
          mockShouldRunFn();
        }
      }

      @Service([[ThisShouldNeverRun, SkipSelf() | Many()]])
      class MyService {
        constructor(public receivedValue: unknown) {}
      }

      expect(() => childContainer.get(MyService)).not.toThrowError();

      const { receivedValue } = childContainer.get(MyService);

      expect(receivedValue).toBeInstanceOf(Array);
      expect((receivedValue as Array<any>).length).toStrictEqual(1);
      expect((receivedValue as Array<any>)[0]).toBeInstanceOf(ThisShouldRun);
    });
  });

  describe('Self', function () {
    it('should error if ID not found in current container, even if its parent has it', function () {
      /** 90% of this was copied from above, with some small modifications. Why re-write it? :-) */
      const childContainer = Container.ofChild(Symbol());
      const mockNeverRunsFn = jest.fn().mockName('Should Not Run');

      @Service([])
      class ThisShouldNeverRun {
        constructor() {
          mockNeverRunsFn();
        }
      }

      @Service({ container: childContainer }, [[ThisShouldNeverRun, Self()]])
      class MyService {
        constructor() {}
      }

      expect(() => childContainer.get(MyService)).toThrowError();
      // expect(mockNeverRunsFn).not.toHaveBeenCalled();
    });

    it('should return null when combined with Optional and the identifier cannot be found', function () {
      const childContainer = Container.ofChild(Symbol());

      @Service([])
      class Dependency {
        constructor() {}
      }

      @Service({ container: childContainer }, [[Dependency, Self() | Optional()]])
      class MyService {
        constructor(public receivedValue: unknown) {}
      }

      expect(() => childContainer.get(MyService)).not.toThrowError();
      expect(childContainer.get(MyService).receivedValue).toBeNull();
    });

    it('should find locally-resolvable identifiers', function () {
      const childContainer = Container.ofChild(Symbol());

      @Service({ container: childContainer }, [])
      class Dependency {
        constructor() {}
      }

      @Service({ container: childContainer }, [[Dependency, Self()]])
      class MyService {
        constructor(public receivedValue: unknown) {}
      }

      expect(() => childContainer.get(MyService)).not.toThrowError();
      expect(childContainer.get(MyService).receivedValue).toBeInstanceOf(Dependency);
    });
  });
});
